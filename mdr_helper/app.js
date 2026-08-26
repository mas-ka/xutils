/**
 * MDR XAFS Metadata Helper - Main Application Logic
 * Vue 3 (Global Build) + js-yaml
 */

// パスユーティリティ
const PathUtils = {
  // パス文字列をトークン配列に変換
  // 例: "@measurement@edges[0].element" -> ["measurement", "edges", 0, "element"]
  parse(pathStr) {
    if (!pathStr) return [];
    let normalized = pathStr.trim();
    if (normalized.startsWith('@')) {
      normalized = normalized.slice(1);
    }
    // [0] を .0 に変換
    normalized = normalized.replace(/\[(\d+)\]/g, '.$1');
    // @ を . に変換
    normalized = normalized.replace(/@/g, '.');
    
    return normalized
      .split('.')
      .filter(token => token !== '')
      .map(token => /^\d+$/.test(token) ? parseInt(token, 10) : token);
  },

  // パス配列から標準的な平坦化表記を復元
  stringify(tokens) {
    if (!tokens || tokens.length === 0) return '';
    let result = '';
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (typeof token === 'number') {
        result += `[${token}]`;
      } else {
        result += (i === 0 ? '@' : '.') + token;
      }
    }
    return result;
  },

  // オブジェクトの特定パスに値をセット
  set(obj, pathStr, value) {
    const tokens = this.parse(pathStr);
    if (tokens.length === 0) return;

    let current = obj;
    for (let i = 0; i < tokens.length - 1; i++) {
      const key = tokens[i];
      const nextKey = tokens[i + 1];

      if (current[key] === undefined || current[key] === null) {
        current[key] = typeof nextKey === 'number' ? [] : {};
      }
      current = current[key];
    }

    const lastKey = tokens[tokens.length - 1];
    current[lastKey] = value;
  },

  // オブジェクトから特定パスの値を取得
  get(obj, pathStr) {
    const tokens = this.parse(pathStr);
    let current = obj;
    for (const token of tokens) {
      if (current === undefined || current === null) return undefined;
      current = current[token];
    }
    return current;
  },

  // オブジェクトから特定パスを削除
  delete(obj, pathStr) {
    const tokens = this.parse(pathStr);
    if (tokens.length === 0) return;

    let current = obj;
    const stack = [];

    for (let i = 0; i < tokens.length - 1; i++) {
      const key = tokens[i];
      if (current[key] === undefined || current[key] === null) return;
      stack.push({ parent: current, key: key });
      current = current[key];
    }

    const lastKey = tokens[tokens.length - 1];
    if (Array.isArray(current) && typeof lastKey === 'number') {
      current.splice(lastKey, 1);
    } else if (current && typeof current === 'object') {
      delete current[lastKey];
    }

    // 空になった親オブジェクト/配列のクリーンアップ（任意）
    for (let i = stack.length - 1; i >= 0; i--) {
      const { parent, key } = stack[i];
      const target = parent[key];
      if (target && typeof target === 'object' && Object.keys(target).length === 0) {
        if (Array.isArray(parent) && typeof key === 'number') {
          parent.splice(key, 1);
        } else {
          delete parent[key];
        }
      }
    }
  },

  // ネストしたオブジェクトを平坦なKey-Valueリストに走査
  flatten(obj, prefix = '') {
    const result = [];
    if (!obj || typeof obj !== 'object') return result;

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const currentPath = prefix 
        ? (Array.isArray(obj) ? `${prefix}[${key}]` : `${prefix}.${key}`)
        : (Array.isArray(obj) ? `@[${key}]` : `@${key}`);

      if (value !== null && typeof value === 'object' && Object.keys(value).length > 0) {
        result.push(...this.flatten(value, currentPath));
      } else if (value !== undefined) {
        result.push({ path: currentPath, value });
      }
    }

    // スキーマ辞書の定義順でソート
    result.sort((a, b) => {
      const orderA = SchemaSorter.getOrder(a.path);
      const orderB = SchemaSorter.getOrder(b.path);
      if (orderA !== orderB) return orderA - orderB;
      return a.path.localeCompare(b.path);
    });

    return result;
  }
};

// スキーマ順ソーター (Pretty-print)
const SchemaSorter = {
  // パス文字列のスキーマ辞書における順位を取得
  getOrder(pathStr) {
    if (!pathStr) return 999999;
    const dictionary = window.SCHEMA_DICTIONARY || [];
    
    // [1], [2] などのインデックスを [0] に正規化し、@ と . を統一
    let norm = pathStr.replace(/\[\d+\]/g, '[0]').replace(/@/g, '.');
    if (!norm.startsWith('.')) norm = '.' + norm;

    // 辞書内で完全一致または前方一致する項目のインデックスを検索
    for (let i = 0; i < dictionary.length; i++) {
      let dictNorm = dictionary[i].path.replace(/\[\d+\]/g, '[0]').replace(/@/g, '.');
      if (!dictNorm.startsWith('.')) dictNorm = '.' + dictNorm;

      if (dictNorm === norm || dictNorm.startsWith(norm + '.') || dictNorm.startsWith(norm + '[')) {
        return i;
      }
    }

    // 大分類トップレベルのフォールバック
    const topCategories = ['data_info', 'facility', 'files', 'instrument', 'measurement', 'sample', 'reference', 'local'];
    for (let c = 0; c < topCategories.length; c++) {
      if (norm.startsWith('.' + topCategories[c])) {
        return 10000 + c * 1000;
      }
    }

    return 999999;
  },

  // オブジェクトをスキーマ定義順に再帰的に並べ替え
  sortObject(obj, currentPath = '') {
    if (obj === null || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map((item, idx) => this.sortObject(item, `${currentPath}[${idx}]`));
    }

    const keys = Object.keys(obj);
    keys.sort((a, b) => {
      const pathA = currentPath ? `${currentPath}.${a}` : `@${a}`;
      const pathB = currentPath ? `${currentPath}.${b}` : `@${b}`;
      const orderA = this.getOrder(pathA);
      const orderB = this.getOrder(pathB);
      if (orderA !== orderB) return orderA - orderB;
      return a.localeCompare(b);
    });

    const sorted = {};
    for (const key of keys) {
      const nextPath = currentPath ? `${currentPath}.${key}` : `@${key}`;
      sorted[key] = this.sortObject(obj[key], nextPath);
    }
    return sorted;
  }
};

// Vue アプリケーション初期化
const { createApp, ref, computed, watch } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      }
    }
  }
});

const app = createApp({
  setup() {
    // スキーマ辞書（グローバルより取得）
    const dictionary = window.SCHEMA_DICTIONARY || [];

    // メイン内部データ（空からスタート）
    const dataObject = ref({});

    // 入力フォームの状態
    const selectedKeyPath = ref('');
    const inputValue = ref('');
    const snackbarText = ref('');
    const showSnackbar = ref(false);
    const filterCategory = ref('ALL');

    // 選択されたKeyのスキーマ定義を特定
    const currentSchema = computed(() => {
      if (!selectedKeyPath.value) return null;
      // 完全一致またはインデックス正規化一致で検索
      const cleanPath = selectedKeyPath.value.replace(/\[\d+\]/g, '[0]');
      return dictionary.find(d => {
        const dClean = d.path.replace(/\[\d+\]/g, '[0]');
        return dClean === cleanPath || d.path === selectedKeyPath.value;
      }) || {
        path: selectedKeyPath.value,
        name_ja: "カスタム項目",
        name_en: "custom key",
        type: "string",
        required: false,
        description: "スキーマ辞書外の自由定義Key"
      };
    });

    // 現在の日付/日時文字列を取得 (YYYY-MM-DD)
    const getCurrentDateString = (includeTime = false) => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      if (!includeTime) return `${y}-${m}-${d}`;
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    };

    // Key選択時の初期値読み込み＆自動補完
    watch(selectedKeyPath, (newPath) => {
      if (newPath) {
        const val = PathUtils.get(dataObject.value, newPath);
        if (val !== undefined && val !== null && val !== '') {
          inputValue.value = val;
        } else {
          // create_time や date 型項目で値が空の場合、現在日付を自動セット
          if (newPath.includes('create_time') || newPath.includes('deposite_time')) {
            inputValue.value = getCurrentDateString(false);
          } else if (newPath.includes('measured_time') || newPath.includes('start_time') || newPath.includes('end_time')) {
            inputValue.value = getCurrentDateString(true);
          } else {
            inputValue.value = '';
          }
        }
      } else {
        inputValue.value = '';
      }
    });

    // 現在日付/日時のセットボタン用アクション
    const setCurrentDate = (includeTime = false) => {
      inputValue.value = getCurrentDateString(includeTime);
    };

    // サジェスト候補リスト（検索用フォーマット）
    const keySuggestions = computed(() => {
      return dictionary.map(d => ({
        title: `${d.path} (${d.name_ja})`,
        value: d.path,
        category: d.category,
        level: d.level || (d.required ? 'required' : 'optional'),
        required: d.required,
        type: d.type,
        name_ja: d.name_ja,
        example: d.example
      }));
    });

    // 現在入力済みのKey-Value一覧
    const existingKeys = computed(() => {
      return PathUtils.flatten(dataObject.value);
    });

    // 必須項目の入力状況判定
    const requiredStatus = computed(() => {
      const requiredDefs = dictionary.filter(d => d.level === 'required' || d.required);
      const total = requiredDefs.length;
      let filledCount = 0;
      const unfilledList = [];

      for (const req of requiredDefs) {
        const val = PathUtils.get(dataObject.value, req.path);
        const isFilled = val !== undefined && val !== null && val !== '';
        if (isFilled) {
          filledCount++;
        } else {
          unfilledList.push(req);
        }
      }

      return {
        total,
        filledCount,
        progress: `${filledCount} / ${total}`,
        isComplete: filledCount === total,
        unfilledList
      };
    });

    // 推奨項目の入力状況判定
    const recommendedStatus = computed(() => {
      const recDefs = dictionary.filter(d => d.level === 'recommended');
      const total = recDefs.length;
      let filledCount = 0;
      const unfilledList = [];

      for (const rec of recDefs) {
        const val = PathUtils.get(dataObject.value, rec.path);
        const isFilled = val !== undefined && val !== null && val !== '';
        if (isFilled) {
          filledCount++;
        } else {
          unfilledList.push(rec);
        }
      }

      return {
        total,
        filledCount,
        progress: `${filledCount} / ${total}`,
        isComplete: filledCount === total,
        unfilledList
      };
    });

    // リアルタイムYAML出力
    const yamlOutput = computed(() => {
      if (!dataObject.value || Object.keys(dataObject.value).length === 0) {
        return '# (現在データは空です。左のフォームからKeyとValueを入力してください)';
      }
      try {
        return jsyaml.dump(dataObject.value, {
          indent: 2,
          lineWidth: -1,
          noRefs: true
        });
      } catch (e) {
        return `# YAML生成エラー: ${e.message}`;
      }
    });

    // ハイライト済みHTML
    const highlightedYaml = computed(() => {
      const raw = yamlOutput.value;
      if (window.hljs) {
        try {
          return window.hljs.highlight(raw, { language: 'yaml' }).value;
        } catch (e) {
          return raw;
        }
      }
      return raw;
    });

    // 値の適用
    const applyValue = () => {
      if (!selectedKeyPath.value) {
        showToast('Keyが指定されていません');
        return;
      }

      let val = inputValue.value;
      const schema = currentSchema.value;

      // 型変換
      if (schema && (schema.type === 'integer' || schema.type === 'double')) {
        if (val !== '' && !isNaN(val)) {
          val = Number(val);
        }
      }

      // セット
      PathUtils.set(dataObject.value, selectedKeyPath.value, val);
      // スキーマ定義順に自動ソート
      dataObject.value = SchemaSorter.sortObject(dataObject.value);
      showToast(`「${selectedKeyPath.value}」を設定しました`);
    };

    // Keyの削除
    const deleteKey = (path) => {
      const targetPath = path || selectedKeyPath.value;
      if (!targetPath) return;

      PathUtils.delete(dataObject.value, targetPath);
      dataObject.value = SchemaSorter.sortObject(dataObject.value);
      if (selectedKeyPath.value === targetPath) {
        inputValue.value = '';
      }
      showToast(`「${targetPath}」を削除しました`);
    };

    // スキーマ順に整列 (Pretty-print 手動実行)
    const prettyPrintData = () => {
      dataObject.value = SchemaSorter.sortObject(dataObject.value);
      showToast('スキーマ定義順に整列しました');
    };

    // 一覧やチップスからKeyを選択
    const selectKey = (path) => {
      selectedKeyPath.value = path;
    };

    // サンプルデータの投入（動作確認用）
    const loadSampleData = () => {
      const rawSample = {
        data_info: {
          title: "XAFS measurement of Cu foil",
          title_ja: "Cu金属箔のXAFS測定",
          data_depositor: {
            name: "Taro KEK",
            organization: "KEK-PF"
          },
          contact_name: {
            name: "Taro KEK",
            organization: "KEK-PF"
          },
          deposite_time: {
            create_time: "2023-02-03"
          },
          license: "CC BY-NC-SA 4.0"
        },
        facility: {
          name: "Photon Factory",
          beamline: "BL-9A",
          ring: {
            energy: 2.5,
            energy_unit: "GeV"
          }
        },
        sample: {
          name: "Copper foil",
          chemical_formula: "Cu",
          phase: "foil"
        },
        measurement: {
          edges: [
            { element: "Cu", edge: "K-edge" }
          ]
        }
      };
      dataObject.value = SchemaSorter.sortObject(rawSample);
      showToast('サンプルデータをロードしました');
    };

    // データの全クリア
    const clearAll = () => {
      dataObject.value = {};
      selectedKeyPath.value = '';
      inputValue.value = '';
      showToast('データをクリアしました');
    };

    // YAMLクリップボードコピー
    const copyYaml = async () => {
      try {
        await navigator.clipboard.writeText(yamlOutput.value);
        showToast('YAMLをクリップボードにコピーしました');
      } catch (err) {
        showToast('コピーに失敗しました');
      }
    };

    // トースト通知
    const showToast = (msg) => {
      snackbarText.value = msg;
      showSnackbar.value = true;
    };

    return {
      dictionary,
      dataObject,
      selectedKeyPath,
      inputValue,
      currentSchema,
      keySuggestions,
      existingKeys,
      requiredStatus,
      recommendedStatus,
      yamlOutput,
      highlightedYaml,
      applyValue,
      deleteKey,
      selectKey,
      prettyPrintData,
      loadSampleData,
      clearAll,
      copyYaml,
      setCurrentDate,
      snackbarText,
      showSnackbar,
      filterCategory
    };
  }
});

app.use(vuetify);
app.mount('#app');
