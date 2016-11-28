elements = [
    {"Name":  "-", "A":  -1.00, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0,   -1.00000,   -1.00000,   -1.00000,   -1.00000,    0.00000], "D": [0,   -1.00000,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name":  "H", "A":  1.008, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 6.37281E-3,   -1.00000,   -1.00000,   -1.00000,    0.00000], "D": [0, 8.85557E-7,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "He", "A":  4.003, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 3.52768E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 5.70284E-5,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Li", "A":  6.941, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 1.06860E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 2.32746E-4,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Be", "A":  9.012, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 2.32021E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 5.62383E-4,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name":  "B", "A":  10.81, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 6.55208E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 5.32657E-3,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name":  "C", "A":  12.01, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 1.29783E+0,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 1.58657E-2,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name":  "N", "A":  14.01, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 2.15669E+0,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 3.54656E-2,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name":  "O", "A":  16.00, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 3.15889E+0,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 6.08875E-2,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name":  "F", "A":  19.00, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 4.43764E+0,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 1.17105E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Ne", "A":  20.18, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 6.15246E+0,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 1.71241E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Na", "A":  22.99, "E": [11.57649, -1.00000, -1.00000, -1.00000], "C": [0,    8.17146,   -1.00000,   -1.00000,   -1.00000,    0.00000], "D": [0,   0.243511,   -1.00000,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Mg", "A":  24.30, "E": [ 9.51220, -1.00000, -1.00000, -1.00000], "C": [0,    11.4825,   0.428634,   -1.00000,   -1.00000,   -1.00000], "D": [0,   0.563119, -0.00485910,  -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Al", "A":  26.98, "E": [ 7.94813, -1.00000, -1.00000, -1.00000], "C": [0,    14.3011,   0.660340,   -1.00000,   -1.00000,   -1.00000], "D": [0,   0.777986, -0.000632844, -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Si", "A":  28.09, "E": [ 6.73800, -1.00000, -1.00000, -1.00000], "C": [0,    18.5265,    1.50185,   -1.00000,   -1.00000,   -1.00000], "D": [0,    1.12537,  0.0835152,   -1.00000,   -1.00000,   -1.00000]},
    {"Name":  "P", "A":  30.97, "E": [ 5.78400, -1.00000, -1.00000, -1.00000], "C": [0,    22.2246,    1.63499,   -1.00000,   -1.00000,   -1.00000], "D": [0,    1.50671,  0.0733512,   -1.00000,   -1.00000,   -1.00000]},
    {"Name":  "S", "A":  32.06, "E": [ 5.01850, -1.00000, -1.00000, -1.00000], "C": [0,    27.8126,    2.12143,   -1.00000,   -1.00000,   -1.00000], "D": [0,    2.09496,   0.100969,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Cl", "A":  35.45, "E": [ 4.39710, -1.00000, -1.00000, -1.00000], "C": [0,    32.0104,    2.75997,   -1.00000,   -1.00000,   -1.00000], "D": [0,    2.65889,   0.180011,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Ar", "A":  39.95, "E": [ 3.87090, -1.00000, -1.00000, -1.00000], "C": [0,    35.7135,    3.46800,   -1.00000,   -1.00000,   -1.00000], "D": [0,    3.25061,   0.296322,   -1.00000,   -1.00000,   -1.00000]},
    {"Name":  "K", "A":  39.10, "E": [ 3.43650, -1.00000, -1.00000, -1.00000], "C": [0,    45.0340,    3.69020,   -1.00000,   -1.00000,   -1.00000], "D": [0,    4.41099,   0.177173,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Ca", "A":  40.08, "E": [ 3.07030, -1.00000, -1.00000, -1.00000], "C": [0,    53.3536,    4.88370,   -1.00000,   -1.00000,   -1.00000], "D": [0,    5.52835,   0.335944,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Sc", "A":  44.96, "E": [ 2.76200, -1.00000, -1.00000, -1.00000], "C": [0,    58.0901,    5.09844,   -1.00000,   -1.00000,   -1.00000], "D": [0,    6.58844,   0.278285,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Ti", "A":  47.88, "E": [ 2.49734, -1.00000, -1.00000, -1.00000], "C": [0,    66.1031,    6.07989,   -1.00000,   -1.00000,   -1.00000], "D": [0,    8.23899,   0.409964,   -1.00000,   -1.00000,   -1.00000]},
    {"Name":  "V", "A":  50.94, "E": [ 2.26910, -1.00000, -1.00000, -1.00000], "C": [0,    74.3794,    6.97585,   -1.00000,   -1.00000,   -1.00000], "D": [0,    10.0213,   0.498368,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Cr", "A":  52.00, "E": [ 2.07020, -1.00000, -1.00000, -1.00000], "C": [0,    87.2791,    8.25584,   -1.00000,   -1.00000,   -1.00000], "D": [0,    12.9651,   0.619703,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Mn", "A":  54.94, "E": [ 1.89643, -1.00000, -1.00000, -1.00000], "C": [0,    97.3142,    9.35977,   -1.00000,   -1.00000,   -1.00000], "D": [0,    15.4675,   0.735756,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Fe", "A":  55.85, "E": [ 1.74346, -1.00000, -1.00000, -1.00000], "C": [0,    112.411,    10.9352,   -1.00000,   -1.00000,   -1.00000], "D": [0,    19.2386,   0.895538,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Co", "A":  58.93, "E": [ 1.60815, -1.00000, -1.00000, -1.00000], "C": [0,    124.301,    12.1931,   -1.00000,   -1.00000,   -1.00000], "D": [0,    22.8686,    1.02979,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Ni", "A":  58.69, "E": [ 1.48807, -1.00000, -1.00000, -1.00000], "C": [0,    145.508,    14.3077,   -1.00000,   -1.00000,   -1.00000], "D": [0,    29.1543,    1.23903,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Cu", "A":  63.55, "E": [ 1.38059, -1.00000, -1.00000, -1.00000], "C": [0,    155.608,    15.3295,   -1.00000,   -1.00000,   -1.00000], "D": [0,    33.6476,    1.35183,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Zn", "A":  65.38, "E": [ 1.28340, -1.00000, -1.00000, -1.00000], "C": [0,    172.647,    17.1802,   -1.00000,   -1.00000,   -1.00000], "D": [0,    39.0360,    1.53729,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Ga", "A":  69.72, "E": [ 1.19580, -1.00000, -1.00000, -1.00000], "C": [0,    184.266,    18.5290,   -1.00000,   -1.00000,   -1.00000], "D": [0,    43.5687,    1.69814,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Ge", "A":  72.59, "E": [ 1.11658, -1.00000, -1.00000, -1.00000], "C": [0,    201.474,    20.3537,   -1.00000,   -1.00000,   -1.00000], "D": [0,    50.4553,    1.90094,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "As", "A":  74.92, "E": [ 1.04500, -1.00000, -1.00000, -1.00000], "C": [0,    222.028,    22.4323,   -1.00000,   -1.00000,   -1.00000], "D": [0,    59.4480,    2.13597,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Se", "A":  78.96, "E": [ 0.97974, -1.00000, -1.00000, -1.00000], "C": [0,    238.655,    24.1441,   -1.00000,   -1.00000,   -1.00000], "D": [0,    68.3062,    2.34267,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Br", "A":  79.90, "E": [ 0.92040, -1.00000, -1.00000, -1.00000], "C": [0,    266.718,    26.9034,   -1.00000,   -1.00000,   -1.00000], "D": [0,    81.9227,    2.65252,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Kr", "A":  83.80, "E": [ 0.86552, -1.00000, -1.00000, -1.00000], "C": [0,    286.927,    28.8858,   -1.00000,   -1.00000,   -1.00000], "D": [0,    94.4726,    2.89010,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Rb", "A":  85.47, "E": [ 0.81554, -1.00000, -1.00000, -1.00000], "C": [0,    315.590,    31.6994,   -1.00000,   -1.00000,   -1.00000], "D": [0,    110.674,    3.21690,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Sr", "A":  87.62, "E": [ 0.76973, -1.00000, -1.00000, -1.00000], "C": [0,    345.817,    35.1658,   -1.00000,   -1.00000,   -1.00000], "D": [0,    129.679,    3.66956,   -1.00000,   -1.00000,   -1.00000]},
    {"Name":  "Y", "A":  88.91, "E": [ 0.72766, -1.00000, -1.00000, -1.00000], "C": [0,    381.149,    38.6742,   -1.00000,   -1.00000,   -1.00000], "D": [0,    152.758,    4.11237,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Zr", "A":  91.22, "E": [ 0.68883, -1.00000, -1.00000, -1.00000], "C": [0,    413.366,    41.9064,   -1.00000,   -1.00000,   -1.00000], "D": [0,    175.778,    4.54111,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Nb", "A":  92.91, "E": [ 0.65298, -1.00000, -1.00000, -1.00000], "C": [0,    452.207,    45.7147,   -1.00000,   -1.00000,   -1.00000], "D": [0,    205.888,    5.06447,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Mo", "A":  95.94, "E": [ 0.61978, -1.00000, -1.00000, -1.00000], "C": [0,    484.805,    49.0026,   -1.00000,   -1.00000,   -1.00000], "D": [0,    233.591,    5.56088,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Tc", "A":  98.00, "E": [ 0.58906, -1.00000, -1.00000, -1.00000], "C": [0,    524.906,    52.9382,   -1.00000,   -1.00000,   -1.00000], "D": [0,    268.153,    6.14192,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Ru", "A": 101.07, "E": [ 0.56051, -1.00000, -1.00000, -1.00000], "C": [0,    560.888,    56.5213,   -1.00000,   -1.00000,   -1.00000], "D": [0,    302.133,    6.68534,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Rh", "A": 102.91, "E": [ 0.53395, -1.00000, -1.00000, -1.00000], "C": [0,    605.407,    60.9269,   -1.00000,   -1.00000,   -1.00000], "D": [0,    343.287,    7.34350,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Pd", "A": 106.42, "E": [ 0.50920, -1.00000, -1.00000, -1.00000], "C": [0,    643.831,    64.5348,   -1.00000,   -1.00000,   -1.00000], "D": [0,    386.545,    7.92650,   -1.00000,   -1.00000,   -1.00000]},
    {"Name": "Ag", "A": 107.87, "E": [ 0.48589,  3.25640,  3.51640,  3.69990], "C": [0,    694.949,    67.1052,    56.6717,    56.5722,    9.93856], "D": [0,    439.551,    7.67543,    6.14712,    8.75905,   0.711367]},
    {"Name": "Cd", "A": 112.41, "E": [ 0.46407,  3.08490,  3.32570,  3.50470], "C": [0,    730.444,    71.0484,    55.6500,    44.4881,    11.3616], "D": [0,    485.025,    8.52106,    5.42216,    5.13813,   0.989776]},
    {"Name": "In", "A": 114.82, "E": [ 0.44371,  2.92600,  3.14730,  3.32370], "C": [0,    784.472,    76.6936,    53.9722,    30.6577,    12.0196], "D": [0,    553.615,    9.66318,    4.06392,   0.326739,    1.00965]},
    {"Name": "Sn", "A": 118.69, "E": [ 0.42467,  2.77690,  2.98230,  3.15570], "C": [0,    822.969,    81.4116,    54.5746,    27.4904,    13.4113], "D": [0,    602.215,    10.7020,    3.50117,   -1.38680,    1.27856]},
    {"Name": "Sb", "A": 121.75, "E": [ 0.40668,  2.63880,  2.82940,  3.00030], "C": [0,    875.664,    87.0624,    58.0477,    28.5821,    15.1089], "D": [0,    676.798,    11.9726,    3.77260,   -1.90044,    1.63757]},
    {"Name": "Te", "A": 127.60, "E": [ 0.38974,  2.50990,  2.68790,  2.85550], "C": [0,    911.635,    91.0391,    59.9937,    31.1593,    14.8603], "D": [0,    745.514,    13.1159,    3.82898,   -1.65648,    1.41398]},
    {"Name":  "I", "A": 126.90, "E": [ 0.37381,  2.38800,  2.55420,  2.71960], "C": [0,    995.160,    100.177,    66.1696,    35.9047,    16.9024], "D": [0,    852.947,    15.1105,    4.45333,   -1.32556,    1.77132]},
    {"Name": "Xe", "A": 131.29, "E": [ 0.35840,  2.27370,  2.42920,  2.59260], "C": [0,    1039.44,    105.856,    70.1323,    39.3209,    17.9151], "D": [0,    926.340,    16.6868,    4.97219,  -0.962795,    1.91131]},
    {"Name": "Cs", "A": 132.91, "E": [ 0.34451,  2.16730,  2.31390,  2.47400], "C": [0,    1116.87,    114.240,    74.5813,    43.3227,    19.7800], "D": [0,    1051.67,    18.7767,    5.01928,  -0.827473,    2.19240]},
    {"Name": "Ba", "A": 137.33, "E": [ 0.33104,  2.06780,  2.20480,  2.36290], "C": [0,    1167.14,    120.333,    78.9889,    46.7526,    21.0243], "D": [0,    1146.46,    20.6409,    5.67820,  -0.467057,    2.40234]},
    {"Name": "La", "A": 138.91, "E": [ 0.31844,  1.97800,  2.10530,  2.26100], "C": [0,    1245.35,    129.354,    92.8072,    63.7723,    22.7001], "D": [0,    1277.49,    23.2190,    10.3699,    5.85966,    2.66187]},
    {"Name": "Ce", "A": 140.12, "E": [ 0.30648,  1.89340,  2.01240,  2.16600], "C": [0,    1336.28,    139.193,    101.026,    56.6258,    24.4804], "D": [0,    1441.76,    25.9849,    12.1545,   0.559391,    2.92807]},
    {"Name": "Pr", "A": 140.91, "E": [ 0.29518,  1.81410,  1.92550,  2.07910], "C": [0,    1423.55,    149.882,    106.916,    61.1684,    26.4114], "D": [0,    1584.91,    29.1351,    12.6061,   0.700409,    3.22751]},
    {"Name": "Nd", "A": 144.24, "E": [ 0.28453,  1.73900,  1.84400,  1.99670], "C": [0,    1504.71,    158.202,    102.800,    67.5037,    27.9034], "D": [0,    1768.09,    31.9683,    8.04476,    2.31172,    3.47719]},
    {"Name": "Pm", "A": 145.00, "E": [ 0.27431,  1.66740,  1.76760,  1.91910], "C": [0,    1601.58,    170.191,    109.222,    74.3825,    29.9780], "D": [0,    1943.85,    35.8364,    8.20810,    3.57716,    3.80278]},
    {"Name": "Sm", "A": 150.36, "E": [ 0.26464,  1.60020,  1.69530,  1.84570], "C": [0,    1659.00,    177.059,    113.250,    73.7846,    31.1624], "D": [0,    2099.70,    38.7761,    8.62873,    1.75173,    4.01415]},
    {"Name": "Eu", "A": 151.96, "E": [ 0.25553,  1.53810,  1.62710,  1.77610], "C": [0,    1756.49,    188.635,    121.943,    78.1424,    33.2040], "D": [0,    2304.26,    42.8534,    10.2779,    1.61176,    4.35730]},
    {"Name": "Gd", "A": 157.25, "E": [ 0.24681,  1.47840,  1.56320,  1.71170], "C": [0,    1817.82,    196.255,    141.570,    83.4691,    34.5057], "D": [0,    2481.27,    46.4167,    21.0541,    3.12755,    4.61042]},
    {"Name": "Tb", "A": 158.93, "E": [ 0.23841,  1.42230,  1.50230,  1.64970], "C": [0,    1927.04,    208.929,    134.543,    88.7297,    36.5784], "D": [0,    2739.30,    51.2478,    11.8831,    3.34837,    4.92098]},
    {"Name": "Dy", "A": 162.50, "E": [ 0.23048,  1.36920,  1.44450,  1.59160], "C": [0,    2007.15,    219.456,    140.375,    93.9872,    38.2675], "D": [0,    2943.08,    55.9766,    12.3773,    4.22734,    5.21775]},
    {"Name": "Ho", "A": 164.93, "E": [ 0.22291,  1.31900,  1.39050,  1.53680], "C": [0,    2108.23,    232.141,    142.392,    99.5414,    40.2809], "D": [0,    3197.55,    61.4934,    8.96614,    4.74175,    5.55414]},
    {"Name": "Er", "A": 167.26, "E": [ 0.21567,  1.27060,  1.33860,  1.48350], "C": [0,    2212.23,    245.398,    151.159,    107.625,    42.3362], "D": [0,    3462.51,    67.3843,    10.2278,    6.94233,    5.88458]},
    {"Name": "Tm", "A": 168.93, "E": [ 0.20880,  1.22500,  1.28920,  1.43340], "C": [0,    2343.47,    260.979,    160.386,    115.258,    44.7197], "D": [0,    3836.32,    74.8544,    11.4528,    8.73306,    6.28779]},
    {"Name": "Yb", "A": 173.04, "E": [ 0.20224,  1.18180,  1.24280,  1.38620], "C": [0,    2428.46,    272.487,    168.399,    117.013,    46.3574], "D": [0,    4093.50,    80.9272,    13.0827,    6.77446,    6.55889]},
    {"Name": "Lu", "A": 174.67, "E": [ 0.19585,  1.14020,  1.19850,  1.34050], "C": [0,    2569.85,    288.565,    176.015,    122.527,    48.7700], "D": [0,    4525.25,    89.0086,    12.4940,    6.47076,    6.97077]},
    {"Name": "Hf", "A": 178.49, "E": [ 0.18982,  1.09970,  1.15480,  1.29720], "C": [0,    2666.37,    302.421,    182.542,    129.630,    50.7314], "D": [0,    4833.51,    96.9848,    12.0169,    8.25911,    7.29965]},
    {"Name": "Ta", "A": 180.95, "E": [ 0.18394,  1.06130,  1.11370,  1.25530], "C": [0,    2788.84,    318.748,    231.516,    136.900,    53.0979], "D": [0,    5211.50,    106.014,    49.9612,    9.41454,    7.69100]},
    {"Name":  "W", "A": 183.85, "E": [ 0.17837,  1.02467,  1.07450,  1.21550], "C": [0,    2906.22,    335.091,    239.057,    144.915,    55.4038], "D": [0,    5593.43,    115.629,    50.3883,    11.3298,    8.08117]},
    {"Name": "Re", "A": 186.21, "E": [ 0.17302,  0.98940,  1.03710,  1.17730], "C": [0,    3032.19,    353.482,    254.942,    176.894,    57.9002], "D": [0,    5988.32,    126.823,    58.2528,    35.8383,    8.50787]},
    {"Name": "Os", "A": 190.20, "E": [ 0.16787,  0.95580,  1.00140,  1.14080], "C": [0,    3142.69,    368.459,    265.007,    184.574,    59.8577], "D": [0,    6399.70,    136.675,    61.9843,    38.8585,    8.82957]},
    {"Name": "Ir", "A": 192.22, "E": [ 0.16292,  0.92360,  0.96710,  1.10580], "C": [0,    3315.42,    388.611,    281.745,    193.963,    62.6021], "D": [0,    7065.63,    149.394,    70.2536,    41.9949,    9.28788]},
    {"Name": "Pt", "A": 195.08, "E": [ 0.15818,  0.89310,  0.93414,  1.07230], "C": [0,    3513.54,    408.501,    289.060,    202.156,    65.1290], "D": [0,    7994.36,    163.232,    69.1196,    44.4161,    9.70975]},
    {"Name": "Au", "A": 196.97, "E": [ 0.15359,  0.86376,  0.90259,  1.04000], "C": [0,    3605.07,    430.288,    307.141,    210.770,    68.0496], "D": [0,    8155.47,    177.846,    78.3935,    46.2825,    10.1993]},
    {"Name": "Hg", "A": 200.59, "E": [ 0.14918,  0.83530,  0.87220,  1.00910], "C": [0,    3733.89,    449.303,    321.275,    219.799,    70.4666], "D": [0,    8666.13,    192.236,    85.4676,    49.9245,    10.6229]},
    {"Name": "Tl", "A": 204.38, "E": [ 0.14495,  0.80810,  0.84340,  0.97930], "C": [0,    3883.59,    469.116,    340.254,    230.708,    72.8198], "D": [0,    9364.59,    208.055,    98.6284,    55.8858,    11.0252]},
    {"Name": "Pb", "A": 207.20, "E": [ 0.14088,  0.78196,  0.81538,  0.95073], "C": [0,    4032.55,    493.479,    352.899,    242.121,    75.5812], "D": [0,    9955.12,    228.190,    102.482,    61.3945,    11.4997]},
    {"Name": "Bi", "A": 208.98, "E": [ 0.13694,  0.75710,  0.78870,  0.92340], "C": [0,    4229.80,    518.583,    375.554,    252.997,    78.8406], "D": [0,    10830.0,    247.562,    117.254,    65.1514,    12.0886]}
];

function calcNSigmaKN(L) {
    if (L >= 2.5) return 0.396;
    var C = [2.56471267e-01, 5.29419953e-01, -1.01637025e+00, 1.11480447e+00, -7.21266885e-01, 2.72401661e-01, -5.55576150e-02, 4.72787421e-03];
    var A = C[7]*L + C[6];
    for (var i = 5 ; i >= 0 ; i--) A = A*L + C[i];
    return A;
}

function getElementNamesZ() {
    var arr = [];
    var Z = 0;
    elements.forEach(function(element){
        arr.push({"Z": Z, "Name": element.Name});
        Z++;
    });
    return arr;
}

function getLambdaOfEdge(Z, typeEdge) {
    return elements[Z].E[typeEdge];
}

function getBothMoR(Z, typeEdge) {
    var E = elements[Z];
    var L = E.E[typeEdge];
    var NSigmaKN = calcNSigmaKN(L);
    var MoR_S = L*L*L*(E.C[typeEdge+1] - L*E.D[typeEdge+1]) + (Z>10?0.0:Z/E.A*NSigmaKN);
    var MoR_L = L*L*L*(E.C[typeEdge+2] - L*E.D[typeEdge+2]) + (Z>10?0.0:Z/E.A*NSigmaKN);
    return [MoR_S, MoR_L];
}

function getMoR(Z, L) {
    var E = elements[Z];
    var NSigmaKN = calcNSigmaKN(L);
    var i = 0;
    if (L <= E.E[0]) i = 1; // shorter than K-edge
    else if (E.E[1] < 0 || L <= E.E[1]) i = 2; // shorter than L1-edge
    else if (E.E[2] < 0 || L <= E.E[2]) i = 3; // shorter than L2-edge
    else if (E.E[3] < 0 || L <= E.E[3]) i = 4; // shorter than L3-edge
    else i = 5; // longer than L3-edge
    return L*L*L*(E.C[i] - L*E.D[i]) + (Z>10?0.0:Z/E.A*NSigmaKN);
}
