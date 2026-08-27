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
    const showYamlTooltips = ref(true);

    // 選択されたKeyのスキーマ定義を特定
    const currentSchema = computed(() => {
      if (!selectedKeyPath.value) return null;
      // 完全一致またはインデックス正規化一致で検索
      const cleanPath = selectedKeyPath.value.replace(/\[\d+\]/g, '[0]').replace(/\./g, '@');
      const found = dictionary.find(d => {
        const dClean = d.path.replace(/\[\d+\]/g, '[0]').replace(/\./g, '@');
        return dClean === cleanPath || d.path === selectedKeyPath.value;
      });

      if (found) return found;

      // @local で始まる場合は公式の独自拡張項目
      if (selectedKeyPath.value.startsWith('@local') || selectedKeyPath.value.startsWith('local.')) {
        return {
          path: selectedKeyPath.value,
          name_ja: "独自拡張パラメータ",
          name_en: "local custom parameter",
          type: "string",
          level: "local",
          isCustom: false,
          required: false,
          description: "JXS共通仕様公式の独自拡張パラメータ枠（@local）です。"
        };
      }

      // それ以外の未定義Key（タイポの可能性あり）
      return {
        path: selectedKeyPath.value,
        name_ja: "⚠️ 仕様外カスタム項目",
        name_en: "non-standard key",
        type: "string",
        level: "custom",
        isCustom: true,
        required: false,
        description: "JXS共通仕様に存在しないKeyです。タイポ（入力間違い）の可能性があります。"
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

    // 現在入力済みのKey-Value一覧（スキーマメタ情報付き）
    const existingKeys = computed(() => {
      const flat = PathUtils.flatten(dataObject.value);
      return flat.map(item => {
        const normPath = item.path.replace(/\[\d+\]/g, '[0]').replace(/\./g, '@');
        const schemaDef = dictionary.find(d => {
          const dictNorm = d.path.replace(/\[\d+\]/g, '[0]').replace(/\./g, '@');
          return dictNorm === normPath;
        });

        const isLocal = item.path.startsWith('@local') || item.path.startsWith('local.');
        const isCustom = !schemaDef && !isLocal;

        return {
          ...item,
          name_ja: schemaDef ? schemaDef.name_ja : (isLocal ? '独自拡張項目' : '仕様外Key'),
          level: schemaDef ? (schemaDef.level || (schemaDef.required ? 'required' : 'optional')) : (isLocal ? 'local' : 'custom'),
          isCustom: isCustom
        };
      });
    });

    // 仕様外Keyの集計
    const customKeysStatus = computed(() => {
      const customItems = existingKeys.value.filter(item => item.isCustom);
      return {
        count: customItems.length,
        list: customItems
      };
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

    // YAML各行の解析とスキーマ逆引き (行クリック編集 & ホバーチップ表示用)
    const yamlLines = computed(() => {
      const raw = yamlOutput.value;
      if (!raw || raw.startsWith('#')) {
        return [{
          index: 0,
          rawText: raw,
          highlightedHtml: window.hljs ? window.hljs.highlight(raw, { language: 'yaml' }).value : raw,
          isClickable: false,
          path: '',
          schemaDef: null
        }];
      }

      const lines = raw.split('\n');
      const result = [];
      const stack = []; // 各階層のスタック { indent, key, isArray, arrayIndex, isFromHyphen }

      lines.forEach((line, idx) => {
        if (!line.trim()) {
          result.push({
            index: idx,
            rawText: '',
            highlightedHtml: '&nbsp;',
            isClickable: false,
            path: '',
            schemaDef: null
          });
          return;
        }

        const indent = line.search(/\S/);
        const trimmed = line.trim();

        // スタックの調整: 現在のインデント以上の深さのスタックを破棄
        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
          stack.pop();
        }

        let key = '';
        let value = '';
        let isClickable = false;

        if (trimmed.startsWith('- ')) {
          // 配列要素 (例: "- element: Cu")
          const content = trimmed.substring(2).trim();
          const colonIdx = content.indexOf(':');

          // 親の配列スタックのインデックスをカウントアップ
          let parentArrayStack = null;
          for (let s = stack.length - 1; s >= 0; s--) {
            if (stack[s].isArray) {
              parentArrayStack = stack[s];
              break;
            }
          }
          let currentArrayIndex = 0;
          if (parentArrayStack) {
            parentArrayStack.arrayIndex = (parentArrayStack.arrayIndex !== undefined ? parentArrayStack.arrayIndex : -1) + 1;
            currentArrayIndex = parentArrayStack.arrayIndex;
          }

          if (colonIdx !== -1) {
            key = content.substring(0, colonIdx).trim();
            value = content.substring(colonIdx + 1).trim();
            isClickable = (value !== '');
            stack.push({
              indent: indent,
              key: key,
              isArray: false,
              arrayIndex: currentArrayIndex,
              isFromHyphen: true
            });
          } else {
            value = content;
            isClickable = true;
          }
        } else {
          const colonIdx = trimmed.indexOf(':');
          if (colonIdx !== -1) {
            key = trimmed.substring(0, colonIdx).trim();
            value = trimmed.substring(colonIdx + 1).trim();
            isClickable = (value !== '');
            const isArrayContainer = (value === '');
            stack.push({
              indent: indent,
              key: key,
              isArray: isArrayContainer,
              arrayIndex: -1,
              isFromHyphen: false
            });
          }
        }

        // 平坦化パス（@facility@name 等）を構築
        let fullPath = '';
        if (stack.length > 0) {
          const pathSegments = [];
          for (let i = 0; i < stack.length; i++) {
            const s = stack[i];
            if (s.isFromHyphen) {
              const prev = pathSegments.pop();
              pathSegments.push(`${prev}[${s.arrayIndex}].${s.key}`);
            } else {
              pathSegments.push(s.key);
            }
          }
          fullPath = '@' + pathSegments.join('@');
        }

        // スキーマ辞書との照合
        let schemaDef = null;
        let level = 'optional';
        let name_ja = '';
        let isCustom = false;

        if (fullPath && isClickable) {
          const cleanPath = fullPath.replace(/\[\d+\]/g, '[0]').replace(/\./g, '@');
          schemaDef = dictionary.find(d => {
            const dClean = d.path.replace(/\[\d+\]/g, '[0]').replace(/\./g, '@');
            return dClean === cleanPath || d.path === fullPath;
          });

          if (schemaDef) {
            level = schemaDef.level || (schemaDef.required ? 'required' : 'optional');
            name_ja = schemaDef.name_ja;
          } else {
            const isLocal = fullPath.startsWith('@local') || fullPath.startsWith('local.');
            if (isLocal) {
              level = 'local';
              name_ja = '独自拡張';
            } else {
              level = 'custom';
              isCustom = true;
              name_ja = '仕様外';
            }
          }
        }

        // 構文ハイライト
        let highlighted = line;
        if (window.hljs) {
          try {
            highlighted = window.hljs.highlight(line, { language: 'yaml' }).value;
          } catch (e) {
            highlighted = line;
          }
        }

        result.push({
          index: idx,
          rawText: line,
          highlightedHtml: highlighted,
          isClickable: isClickable,
          path: fullPath,
          value: value,
          schemaDef: (schemaDef || isClickable) ? { level, name_ja, isCustom } : null,
          level: level,
          name_ja: name_ja,
          isCustom: isCustom
        });
      });

      return result;
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

    // -------------------------------------------------------------
    // ファイル読み込み・マージ・衝突解決ロジック
    // -------------------------------------------------------------
    const isDraggingOver = ref(false);
    const showConflictDialog = ref(false);
    const conflictList = ref([]);
    const pendingNonConflicts = ref([]);
    const loadedFileName = ref('');

    // ファイル処理の共通エントリーポイント
    const processFileContent = (contentStr, fileName = 'ファイル') => {
      try {
        let loadedObj = null;
        if (fileName.endsWith('.json')) {
          loadedObj = JSON.parse(contentStr);
        } else {
          loadedObj = jsyaml.load(contentStr);
        }

        if (!loadedObj || typeof loadedObj !== 'object') {
          showToast('有効なYAML/JSONオブジェクトが見つかりませんでした');
          return;
        }

        loadedFileName.value = fileName;
        const incomingEntries = PathUtils.flatten(loadedObj);
        const conflicts = [];
        const nonConflicts = [];

        for (const entry of incomingEntries) {
          const currentVal = PathUtils.get(dataObject.value, entry.path);
          const hasCurrentVal = currentVal !== undefined && currentVal !== null && currentVal !== '';

          if (!hasCurrentVal) {
            // 既存が未設定の場合は衝突なし（自動取り込み）
            nonConflicts.push(entry);
          } else {
            // 既存に値がある場合
            if (JSON.stringify(currentVal) === JSON.stringify(entry.value)) {
              // 完全一致は衝突と見なさない
              continue;
            } else {
              // 値が異なる（空値による上書き＝削除を含む）場合は衝突
              const normPath = entry.path.replace(/\[\d+\]/g, '[0]').replace(/\./g, '@');
              const schemaDef = dictionary.find(d => {
                const dictNorm = d.path.replace(/\[\d+\]/g, '[0]').replace(/\./g, '@');
                return dictNorm === normPath;
              });

              conflicts.push({
                path: entry.path,
                name_ja: schemaDef ? schemaDef.name_ja : entry.path.split('.').pop(),
                level: schemaDef ? (schemaDef.level || (schemaDef.required ? 'required' : 'optional')) : 'optional',
                currentVal: currentVal,
                incomingVal: entry.value,
                action: 'overwrite' // デフォルトは上書き
              });
            }
          }
        }

        if (conflicts.length === 0) {
          // 衝突なし: すべて自動マージ
          for (const item of nonConflicts) {
            PathUtils.set(dataObject.value, item.path, item.value);
          }
          dataObject.value = SchemaSorter.sortObject(dataObject.value);
          showToast(`「${fileName}」から ${nonConflicts.length} 項目を取り込みました`);
        } else {
          // 衝突あり: ダイアログ表示
          pendingNonConflicts.value = nonConflicts;
          conflictList.value = conflicts;
          showConflictDialog.value = true;
        }
      } catch (err) {
        showToast(`ファイルの解析に失敗しました: ${err.message}`);
      }
    };

    // 一括アクション選択 (すべて上書き / すべてスキップ)
    const setAllConflictActions = (action) => {
      for (const item of conflictList.value) {
        item.action = action;
      }
    };

    // 衝突解消の適用
    const applyConflictResolution = () => {
      // 1. 非衝突項目を適用
      for (const item of pendingNonConflicts.value) {
        PathUtils.set(dataObject.value, item.path, item.value);
      }

      // 2. 衝突項目を選択に従って適用
      let overwrittenCount = 0;
      let skippedCount = 0;

      for (const item of conflictList.value) {
        if (item.action === 'overwrite') {
          if (item.incomingVal === null || item.incomingVal === undefined || item.incomingVal === '') {
            PathUtils.delete(dataObject.value, item.path);
          } else {
            PathUtils.set(dataObject.value, item.path, item.incomingVal);
          }
          overwrittenCount++;
        } else {
          skippedCount++;
        }
      }

      dataObject.value = SchemaSorter.sortObject(dataObject.value);
      showConflictDialog.value = false;
      showToast(`マージ完了: ${overwrittenCount + pendingNonConflicts.value.length} 項目を反映、${skippedCount} 項目をスキップしました`);
    };

    // 衝突解決のキャンセル
    const cancelConflictResolution = () => {
      showConflictDialog.value = false;
      conflictList.value = [];
      pendingNonConflicts.value = [];
      showToast('読み込みをキャンセルしました');
    };

    // ファイル選択イベント処理
    const handleFileInput = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        processFileContent(event.target.result, file.name);
      };
      reader.readAsText(file);
      e.target.value = ''; // リセット
    };

    // ドラッグ＆ドロップイベント
    const handleDrop = (e) => {
      isDraggingOver.value = false;
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        processFileContent(event.target.result, file.name);
      };
      reader.readAsText(file);
    };

    // -------------------------------------------------------------
    // ファイル保存（エクスポート）
    // -------------------------------------------------------------
    const downloadFile = (content, filename, type) => {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const saveYamlFile = () => {
      if (!dataObject.value || Object.keys(dataObject.value).length === 0) {
        showToast('保存するデータがありません');
        return;
      }
      const yamlStr = jsyaml.dump(dataObject.value, { indent: 2, lineWidth: -1, noRefs: true });
      downloadFile(yamlStr, 'metadata.yml', 'text/yaml;charset=utf-8;');
      showToast('「metadata.yml」を保存しました');
    };

    const saveJsonFile = () => {
      if (!dataObject.value || Object.keys(dataObject.value).length === 0) {
        showToast('保存するデータがありません');
        return;
      }
      const jsonStr = JSON.stringify(dataObject.value, null, 2);
      downloadFile(jsonStr, 'metadata.json', 'application/json;charset=utf-8;');
      showToast('「metadata.json」を保存しました');
    };

    // MDR Web登録フォーム用テキストコピー
    const copyMdrText = async () => {
      const getVal = (path) => PathUtils.get(dataObject.value, path) || '未設定';
      const mdrSummary = [
        `【MDR XAFS DB Webフォーム入力用サマリー】`,
        `・タイトル (Title): ${getVal('@data_info@title')}`,
        `・日本語タイトル: ${getVal('@data_info@title_ja')}`,
        `・登録者氏名 (Creator): ${getVal('@data_info@data_depositor@name')}`,
        `・所属組織 (Affiliation): ${getVal('@data_info@data_depositor@organization')}`,
        `・測定元素 (Element): ${getVal('@measurement@edges[0].element')}`,
        `・吸収端 (Edge): ${getVal('@measurement@edges[0].edge')}`,
        `・施設名 (Facility): ${getVal('@facility@name')}`,
        `・ビームライン (Beamline): ${getVal('@facility@beamline')}`,
        `・物質名 (Sample Name): ${getVal('@sample@name')}`,
        `・化学式 (Formula): ${getVal('@sample@chemical_formula')}`,
        `・相状態 (Phase): ${getVal('@sample@phase')}`,
        `・ライセンス (License): ${getVal('@data_info@license')}`
      ].join('\n');

      try {
        await navigator.clipboard.writeText(mdrSummary);
        showToast('MDR登録用サマリーをクリップボードにコピーしました');
      } catch (err) {
        showToast('コピーに失敗しました');
      }
    };

    // ヘルプモーダル状態
    const showHelpDialog = ref(false);
    const showAboutDialog = ref(false);

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
      customKeysStatus,
      yamlOutput,
      highlightedYaml,
      yamlLines,
      applyValue,
      deleteKey,
      selectKey,
      loadSampleData,
      clearAll,
      copyYaml,
      setCurrentDate,
      snackbarText,
      showSnackbar,
      filterCategory,
      showYamlTooltips,
      // ロード・マージ・保存・D&D
      isDraggingOver,
      showConflictDialog,
      conflictList,
      loadedFileName,
      setAllConflictActions,
      applyConflictResolution,
      cancelConflictResolution,
      handleFileInput,
      handleDrop,
      saveYamlFile,
      saveJsonFile,
      copyMdrText,
      showHelpDialog,
      showAboutDialog
    };
  }
});

app.use(vuetify);
app.mount('#app');
