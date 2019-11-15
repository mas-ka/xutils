elements = [
    {"Name":  "-", "A":  0.000, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0,   -1.00000,   -1.00000,   -1.00000,   -1.00000,    0.00000], "D": [0,   -1.00000,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "B": [0,   0.000000,   -0.00000,   -0.00000,   -0.00000,    0.00000], "RHO": 0.000},
    {"Name":  "H", "A":  1.008, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 6.37281E-3,   -1.00000,   -1.00000,   -1.00000,    0.00000], "D": [0, 8.85557E-7,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "B": [0,   0.000000,   -0.00000,   -0.00000,   -0.00000,    0.00000], "RHO": 0.0898e-3},
    {"Name": "He", "A":  4.003, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 3.52768E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 5.70284E-5,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "B": [0,   0.000000,   -0.00000,   -0.00000,   -0.00000,    0.00000], "RHO": 0.1785e-3},
    {"Name": "Li", "A":  6.941, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 1.06860E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 2.32746E-4,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "B": [0,   0.000000,   -0.00000,   -0.00000,   -0.00000,    0.00000], "RHO": 0.534},
    {"Name": "Be", "A":  9.012, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 2.32021E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 5.62383E-4,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "B": [0,   0.000000,   -0.00000,   -0.00000,   -0.00000,    0.00000], "RHO": 1.850},
    {"Name":  "B", "A":  10.81, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 6.55208E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 5.32657E-3,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "B": [0,   0.000000,   -0.00000,   -0.00000,   -0.00000,    0.00000], "RHO": 2.080},
    {"Name":  "C", "A":  12.01, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 1.29783E+0,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 1.58657E-2,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "B": [0,   0.000000,   -0.00000,   -0.00000,   -0.00000,    0.00000], "RHO": 2.260},
    {"Name":  "N", "A":  14.01, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 2.15669E+0,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 3.54656E-2,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "B": [0,   0.000000,   -0.00000,   -0.00000,   -0.00000,    0.00000], "RHO": 1.250e-3},
    {"Name":  "O", "A":  16.00, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 3.15889E+0,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 6.08875E-2,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "B": [0,   0.000000,   -0.00000,   -0.00000,   -0.00000,    0.00000], "RHO": 1.429e-3},
    {"Name":  "F", "A":  19.00, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 4.43764E+0,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 1.17105E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "B": [0,   0.000000,   -0.00000,   -0.00000,   -0.00000,    0.00000], "RHO": 1.710e-3},
    {"Name": "Ne", "A":  20.18, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0, 6.15246E+0,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "D": [0, 1.71241E-1,   -1.00000,   -1.00000,   -1.00000,   -1.00000], "B": [0,   0.000000,   -0.00000,   -0.00000,   -0.00000,    0.00000], "RHO": 0.900e-3},
    {"Name": "Na", "A":  22.99, "E": [-1.00000, -1.00000, -1.00000, -1.00000], "C": [0,    8.60108,   -1.00000,   -1.00000,   -1.00000,    0.00000], "D": [0,   0.338914,    1.00000,    1.00000,    1.00000,    0.00000], "B": [0,  -0.466405,    0.00000,    0.00000,    0.00000,    0.00000], "RHO": 0.968},
    {"Name": "Mg", "A":  24.30, "E": [ 9.51220, -1.00000, -1.00000, -1.00000], "C": [0,    12.2494,   -38.2265,   -1.00000,   -1.00000,   -1.00000], "D": [0,   0.627349,   -2.03783,    1.00000,    1.00000,    1.00000], "B": [0,   -1.49166,    183.748,    0.00000,    0.00000,    0.00000], "RHO": 1.738},
    {"Name": "Al", "A":  26.98, "E": [ 7.94813, -1.00000, -1.00000, -1.00000], "C": [0,    14.5521,   -468.852,   -1.00000,   -1.00000,   -1.00000], "D": [0,   0.802180,   -29.5071,    1.00000,    1.00000,    1.00000], "B": [0,  -0.467714,    1867.74,    0.00000,    0.00000,    0.00000], "RHO": 2.700},
    {"Name": "Si", "A":  28.09, "E": [ 6.73800, -1.00000, -1.00000, -1.00000], "C": [0,    18.2703,   -2056.26,   -1.00000,   -1.00000,   -1.00000], "D": [0,    1.09739,   -152.368,    1.00000,    1.00000,    1.00000], "B": [0,   0.455811,    6943.83,    0.00000,    0.00000,    0.00000], "RHO": 2.329},
    {"Name":  "P", "A":  30.97, "E": [ 5.78400, -1.00000, -1.00000, -1.00000], "C": [0,    21.6449,   -2534.60,   -1.00000,   -1.00000,   -1.00000], "D": [0,    1.43576,   -219.127,    1.00000,    1.00000,    1.00000], "B": [0,   0.982428,    7336.31,    0.00000,    0.00000,    0.00000], "RHO": 2.690},
    {"Name":  "S", "A":  32.06, "E": [ 5.01850, -1.00000, -1.00000, -1.00000], "C": [0,    26.5138,   -564.941,   -1.00000,   -1.00000,   -1.00000], "D": [0,    1.91897,   -56.3557,    1.00000,    1.00000,    1.00000], "B": [0,    2.09119,    1423.92,    0.00000,    0.00000,    0.00000], "RHO": 2.070},
    {"Name": "Cl", "A":  35.45, "E": [ 4.39710, -1.00000, -1.00000, -1.00000], "C": [0,    29.8601,    3489.66,   -1.00000,   -1.00000,   -1.00000], "D": [0,    2.33882,    396.440,    1.00000,    1.00000,    1.00000], "B": [0,    3.27627,   -7670.75,    0.00000,    0.00000,    0.00000], "RHO": 3.214e-3},
    {"Name": "Ar", "A":  39.95, "E": [ 3.87090, -1.00000, -1.00000, -1.00000], "C": [0,    32.6754,   -5702.58,   -1.00000,   -1.00000,   -1.00000], "D": [0,    2.75534,   -735.425,    1.00000,    1.00000,    1.00000], "B": [0,    4.35081,    11063.6,    0.00000,    0.00000,    0.00000], "RHO": 1.784e-3},
    {"Name":  "K", "A":  39.10, "E": [ 3.43650, -1.00000, -1.00000, -1.00000], "C": [0,    39.7384,    3993.71,   -1.00000,   -1.00000,   -1.00000], "D": [0,    3.46484,    579.472,    1.00000,    1.00000,    1.00000], "B": [0,    7.05339,   -6870.53,    0.00000,    0.00000,    0.00000], "RHO": 0.862},
    {"Name": "Ca", "A":  40.08, "E": [ 3.07030, -1.00000, -1.00000, -1.00000], "C": [0,    43.4913,   -4874.96,   -1.00000,   -1.00000,   -1.00000], "D": [0,    3.57904,   -792.604,    1.00000,    1.00000,    1.00000], "B": [0,    11.9809,    7507.78,    0.00000,    0.00000,    0.00000], "RHO": 1.550},
    {"Name": "Sc", "A":  44.96, "E": [ 2.76200, -1.00000, -1.00000, -1.00000], "C": [0,    46.5975,    8.20538,   -1.00000,   -1.00000,   -1.00000], "D": [0,    4.06307,   0.830339,    1.00000,    1.00000,    1.00000], "B": [0,    12.5644,   -4.37022,    0.00000,    0.00000,    0.00000], "RHO": 2.985},
    {"Name": "Ti", "A":  47.88, "E": [ 2.49734, -1.00000, -1.00000, -1.00000], "C": [0,    52.8757,    4.90833,   -1.00000,   -1.00000,   -1.00000], "D": [0,    5.02741,   0.189674,    1.00000,    1.00000,    1.00000], "B": [0,    13.0867,    1.55280,    0.00000,    0.00000,    0.00000], "RHO": 4.506},
    {"Name":  "V", "A":  50.94, "E": [ 2.26910, -1.00000, -1.00000, -1.00000], "C": [0,    58.5128,    6.12632,   -1.00000,   -1.00000,   -1.00000], "D": [0,    5.78266,   0.330592,    1.00000,    1.00000,    1.00000], "B": [0,    14.2669,    1.06618,    0.00000,    0.00000,    0.00000], "RHO": 6.000},
    {"Name": "Cr", "A":  52.00, "E": [ 2.07020, -1.00000, -1.00000, -1.00000], "C": [0,    70.0145,    6.96976,   -1.00000,   -1.00000,   -1.00000], "D": [0,    7.91242,   0.354958,    1.00000,    1.00000,    1.00000], "B": [0,    14.1693,    1.53699,    0.00000,    0.00000,    0.00000], "RHO": 7.190},
    {"Name": "Mn", "A":  54.94, "E": [ 1.89643, -1.00000, -1.00000, -1.00000], "C": [0,    76.6255,    7.93906,   -1.00000,   -1.00000,   -1.00000], "D": [0,    8.85859,   0.433075,    1.00000,    1.00000,    1.00000], "B": [0,    15.5552,    1.62655,    0.00000,    0.00000,    0.00000], "RHO": 7.210},
    {"Name": "Fe", "A":  55.85, "E": [ 1.74346, -1.00000, -1.00000, -1.00000], "C": [0,    87.9862,    9.31015,   -1.00000,   -1.00000,   -1.00000], "D": [0,    10.7543,   0.539810,    1.00000,    1.00000,    1.00000], "B": [0,    16.8882,    1.79563,    0.00000,    0.00000,    0.00000], "RHO": 7.874},
    {"Name": "Co", "A":  58.93, "E": [ 1.60815, -1.00000, -1.00000, -1.00000], "C": [0,    97.0444,    10.1615,   -1.00000,   -1.00000,   -1.00000], "D": [0,    12.6068,   0.575597,    1.00000,    1.00000,    1.00000], "B": [0,    17.3870,    2.18121,    0.00000,    0.00000,    0.00000], "RHO": 8.900},
    {"Name": "Ni", "A":  58.69, "E": [ 1.48807, -1.00000, -1.00000, -1.00000], "C": [0,    114.462,    12.0165,   -1.00000,   -1.00000,   -1.00000], "D": [0,    16.5206,   0.718547,    1.00000,    1.00000,    1.00000], "B": [0,    18.3219,    2.40480,    0.00000,    0.00000,    0.00000], "RHO": 8.908},
    {"Name": "Cu", "A":  63.55, "E": [ 1.38059, -1.00000, -1.00000, -1.00000], "C": [0,    122.405,    12.8815,   -1.00000,   -1.00000,   -1.00000], "D": [0,    19.0887,   0.790030,    1.00000,    1.00000,    1.00000], "B": [0,    18.1864,    2.53241,    0.00000,    0.00000,    0.00000], "RHO": 8.940},
    {"Name": "Zn", "A":  65.38, "E": [ 1.28340, -1.00000, -1.00000, -1.00000], "C": [0,    129.694,    14.6409,   -1.00000,   -1.00000,   -1.00000], "D": [0,    18.7756,   0.950826,    1.00000,    1.00000,    1.00000], "B": [0,    21.8696,    2.60289,    0.00000,    0.00000,    0.00000], "RHO": 7.140},
    {"Name": "Ga", "A":  69.72, "E": [ 1.19580, -1.00000, -1.00000, -1.00000], "C": [0,    133.506,    16.1886,   -1.00000,   -1.00000,   -1.00000], "D": [0,    17.8685,    1.15681,    1.00000,    1.00000,    1.00000], "B": [0,    24.0778,    2.39478,    0.00000,    0.00000,    0.00000], "RHO": 5.910},
    {"Name": "Ge", "A":  72.59, "E": [ 1.11658, -1.00000, -1.00000, -1.00000], "C": [0,    143.772,    17.8487,   -1.00000,   -1.00000,   -1.00000], "D": [0,    19.1640,    1.32132,    1.00000,    1.00000,    1.00000], "B": [0,    25.5554,    2.56235,    0.00000,    0.00000,    0.00000], "RHO": 5.323},
    {"Name": "As", "A":  74.92, "E": [ 1.04500, -1.00000, -1.00000, -1.00000], "C": [0,    159.725,    19.6592,   -1.00000,   -1.00000,   -1.00000], "D": [0,    23.3375,    1.49616,    1.00000,    1.00000,    1.00000], "B": [0,    25.8180,    2.84949,    0.00000,    0.00000,    0.00000], "RHO": 5.727},
    {"Name": "Se", "A":  78.96, "E": [ 0.97974, -1.00000, -1.00000, -1.00000], "C": [0,    170.724,    21.2713,   -1.00000,   -1.00000,   -1.00000], "D": [0,    26.3016,    1.68314,    1.00000,    1.00000,    1.00000], "B": [0,    26.3890,    2.97445,    0.00000,    0.00000,    0.00000], "RHO": 4.810},
    {"Name": "Br", "A":  79.90, "E": [ 0.92040, -1.00000, -1.00000, -1.00000], "C": [0,    192.829,    23.6002,   -1.00000,   -1.00000,   -1.00000], "D": [0,    33.2917,    1.89657,    1.00000,    1.00000,    1.00000], "B": [0,    26.9681,    3.43655,    0.00000,    0.00000,    0.00000], "RHO": 3.103},
    {"Name": "Kr", "A":  83.80, "E": [ 0.86552, -1.00000, -1.00000, -1.00000], "C": [0,    210.844,    25.3463,   -1.00000,   -1.00000,   -1.00000], "D": [0,    41.2292,    2.08196,    1.00000,    1.00000,    1.00000], "B": [0,    26.1159,    3.69520,    0.00000,    0.00000,    0.00000], "RHO": 3.708e-3},
    {"Name": "Rb", "A":  85.47, "E": [ 0.81554, -1.00000, -1.00000, -1.00000], "C": [0,    230.761,    27.7230,   -1.00000,   -1.00000,   -1.00000], "D": [0,    47.6790,    2.31282,    1.00000,    1.00000,    1.00000], "B": [0,    27.4434,    4.17692,    0.00000,    0.00000,    0.00000], "RHO": 1.532},
    {"Name": "Sr", "A":  87.62, "E": [ 0.76973, -1.00000, -1.00000, -1.00000], "C": [0,    255.599,    30.5613,   -1.00000,   -1.00000,   -1.00000], "D": [0,    58.6894,    2.62660,    1.00000,    1.00000,    1.00000], "B": [0,    27.5489,    4.86282,    0.00000,    0.00000,    0.00000], "RHO": 2.640},
    {"Name":  "Y", "A":  88.91, "E": [ 0.72766, -1.00000, -1.00000, -1.00000], "C": [0,    285.447,    33.6130,   -1.00000,   -1.00000,   -1.00000], "D": [0,    73.0850,    2.96923,    1.00000,    1.00000,    1.00000], "B": [0,    27.6238,    5.36703,    0.00000,    0.00000,    0.00000], "RHO": 4.472},
    {"Name": "Zr", "A":  91.22, "E": [ 0.68883, -1.00000, -1.00000, -1.00000], "C": [0,    309.929,    36.2921,   -1.00000,   -1.00000,   -1.00000], "D": [0,    84.8116,    3.27674,    1.00000,    1.00000,    1.00000], "B": [0,    28.2694,    5.97828,    0.00000,    0.00000,    0.00000], "RHO": 6.520},
    {"Name": "Nb", "A":  92.91, "E": [ 0.65298, -1.00000, -1.00000, -1.00000], "C": [0,    346.972,    39.6430,   -1.00000,   -1.00000,   -1.00000], "D": [0,    108.277,    3.70055,    1.00000,    1.00000,    1.00000], "B": [0,    27.2756,    6.48827,    0.00000,    0.00000,    0.00000], "RHO": 8.570},
    {"Name": "Mo", "A":  95.94, "E": [ 0.61978, -1.00000, -1.00000, -1.00000], "C": [0,    369.633,    42.4215,   -1.00000,   -1.00000,   -1.00000], "D": [0,    121.039,    4.08509,    1.00000,    1.00000,    1.00000], "B": [0,    28.3376,    7.04935,    0.00000,    0.00000,    0.00000], "RHO": 10.280},
    {"Name": "Tc", "A":  98.00, "E": [ 0.58906, -1.00000, -1.00000, -1.00000], "C": [0,    403.756,    45.6161,   -1.00000,   -1.00000,   -1.00000], "D": [0,    143.609,    4.50295,    1.00000,    1.00000,    1.00000], "B": [0,    28.3472,    7.86310,    0.00000,    0.00000,    0.00000], "RHO": 11.000},
    {"Name": "Ru", "A": 101.07, "E": [ 0.56051, -1.00000, -1.00000, -1.00000], "C": [0,    430.375,    48.5354,   -1.00000,   -1.00000,   -1.00000], "D": [0,    161.150,    4.89969,    1.00000,    1.00000,    1.00000], "B": [0,    29.0644,    8.58851,    0.00000,    0.00000,    0.00000], "RHO": 12.450},
    {"Name": "Rh", "A": 102.91, "E": [ 0.53395, -1.00000, -1.00000, -1.00000], "C": [0,    460.343,    51.9308,   -1.00000,   -1.00000,   -1.00000], "D": [0,    178.815,    5.33463,    1.00000,    1.00000,    1.00000], "B": [0,    30.7940,    9.69260,    0.00000,    0.00000,    0.00000], "RHO": 12.410},
    {"Name": "Pd", "A": 106.42, "E": [ 0.50920, -1.00000, -1.00000, -1.00000], "C": [0,    492.809,    54.8734,   -1.00000,   -1.00000,   -1.00000], "D": [0,    207.041,    5.77121,    1.00000,    1.00000,    1.00000], "B": [0,    30.5952,    10.4236,    0.00000,    0.00000,    0.00000], "RHO": 12.023},
    {"Name": "Ag", "A": 107.87, "E": [ 0.48589,  3.25640,  3.51640,  3.69990], "C": [0,    515.893,    55.8027,    56.9469,    2038.35,    200.523], "D": [0,    216.643,    5.55951,    6.18774,    283.355,    26.4191], "B": [0,    34.6446,    14.4374,  -0.465361,   -3573.70,   -353.225], "RHO": 10.490},
    {"Name": "Cd", "A": 112.41, "E": [ 0.46407,  3.08490,  3.32570,  3.50470], "C": [0,    562.276,    59.3445,    183.894,   -173.243,    531.953], "D": [0,    265.992,    6.21595,    25.4241,   -26.7354,    75.1099], "B": [0,    31.1203,    14.2565,   -205.305,    371.620,   -914.108], "RHO": 8.650},
    {"Name": "In", "A": 114.82, "E": [ 0.44371,  2.92600,  3.14730,  3.32370], "C": [0,    622.024,    64.4177,    45.6740,   -163.233,    1027.24], "D": [0,    332.376,    7.11300,    2.69764,   -29.6337,    153.409], "B": [0,    28.7563,    14.1868,    12.5852,    313.495,   -1690.76], "RHO": 7.310},
    {"Name": "Sn", "A": 118.69, "E": [ 0.42467,  2.77690,  2.98230,  3.15570], "C": [0,    631.003,    68.0418,   -136.158,   -247.411,   -2135.95], "D": [0,    329.087,    7.77651,   -29.6087,   -46.1712,   -338.514], "B": [0,    32.5399,    14.6670,    274.388,    421.574,    3398.95], "RHO": 7.365},
    {"Name": "Sb", "A": 121.75, "E": [ 0.40668,  2.63880,  2.82940,  3.00030], "C": [0,    676.812,    72.6419,   -105.214,   -419.249,    446.191], "D": [0,    381.569,    8.65220,   -26.0785,   -78.7085,    73.3147], "B": [0,    32.3226,    15.0316,    223.003,    652.307,   -648.154], "RHO": 6.697},
    {"Name": "Te", "A": 127.60, "E": [ 0.38974,  2.50990,  2.68790,  2.85550], "C": [0,    730.098,    76.3391,   -177.256,   -351.317,    126.486], "D": [0,    464.601,    9.55833,   -41.8082,   -70.6430,    20.8854], "B": [0,    28.3339,    14.5768,    308.046,    529.739,   -159.980], "RHO": 6.232},
    {"Name":  "I", "A": 126.90, "E": [ 0.37381,  2.38800,  2.55420,  2.71960], "C": [0,    792.625,    84.4156,   -169.964,   -410.030,    4.10371], "D": [0,    526.668,    11.1053,   -43.3062,   -85.8486,  -0.521516], "B": [0,    30.3920,    14.8821,    291.609,    587.703,    17.8518], "RHO": 4.933},
    {"Name": "Xe", "A": 131.29, "E": [ 0.35840,  2.27370,  2.42920,  2.59260], "C": [0,    818.291,    89.4137,   -178.440,   -401.810,    13.1513], "D": [0,    555.619,    12.2932,   -47.8791,   -88.8065,    1.03401], "B": [0,    31.9183,    14.7635,    292.017,    553.340,    6.45579], "RHO": 5.841e-3},
    {"Name": "Cs", "A": 132.91, "E": [ 0.34451,  2.16730,  2.31390,  2.47400], "C": [0,    902.545,    96.2627,   -178.271,   -440.791,    13.4436], "D": [0,    678.027,    13.7444,   -51.3897,   -101.944,   0.995077], "B": [0,    29.7623,    15.4053,    283.116,    578.924,    8.35386], "RHO": 1.930},
    {"Name": "Ba", "A": 137.33, "E": [ 0.33104,  2.06780,  2.20480,  2.36290], "C": [0,    946.497,    101.201,   -177.940,   -431.674,    15.5195], "D": [0,    747.620,    15.0282,   -54.4303,   -105.201,    1.33700], "B": [0,    29.6103,    15.6432,    274.339,    545.839,    7.06884], "RHO": 3.510},
    {"Name": "La", "A": 138.91, "E": [ 0.31844,  1.97800,  2.10530,  2.26100], "C": [0,    998.426,    109.385,   -13.2298,   -77.7910,    16.4983], "D": [0,    813.467,    17.0856,   -15.5985,   -26.5615,    1.43536], "B": [0,    31.8740,    15.5925,    108.165,    154.370,    7.77109], "RHO": 6.162},
    {"Name": "Ce", "A": 140.12, "E": [ 0.30648,  1.89340,  2.01240,  2.16600], "C": [0,    1118.46,    117.513,   -26.7631,   -451.745,    17.4148], "D": [0,    1017.31,    19.0252,   -20.5706,   -121.117,    1.50239], "B": [0,    27.1457,    16.1932,    124.663,    530.415,    8.64870], "RHO": 6.770},
    {"Name": "Pr", "A": 140.91, "E": [ 0.29518,  1.81410,  1.92550,  2.07910], "C": [0,    1147.43,    126.164,    7.06797,   -485.089,    19.1210], "D": [0,    1028.93,    21.1883,   -14.0949,   -135.710,    1.72924], "B": [0,    33.3870,    16.9729,    93.2827,    546.230,    8.73010], "RHO": 6.770},
    {"Name": "Nd", "A": 144.24, "E": [ 0.28453,  1.73900,  1.84400,  1.99670], "C": [0,    1257.76,    132.952,   -196.490,   -438.761,    19.0295], "D": [0,    1252.20,    23.1447,   -75.4634,   -129.468,    1.62356], "B": [0,    28.7802,    17.3216,    267.992,    485.622,    10.4161], "RHO": 7.010},
    {"Name": "Pm", "A": 145.00, "E": [ 0.27431,  1.66740,  1.76760,  1.91910], "C": [0,    1318.14,    143.354,   -247.615,   -406.683,    20.6856], "D": [0,    1333.53,    26.0625,   -95.6329,   -126.880,    1.83242], "B": [0,    32.1404,    17.6627,    306.369,    442.891,    10.7039], "RHO": 7.260},
    {"Name": "Sm", "A": 150.36, "E": [ 0.26464,  1.60020,  1.69530,  1.84570], "C": [0,    1385.52,    148.371,   -367.389,   -537.676,    20.9318], "D": [0,    1489.80,    27.8889,   -137.145,   -170.890,    1.81407], "B": [0,    29.9457,    18.1157,    395.955,    540.633,    11.5722], "RHO": 7.520},
    {"Name": "Eu", "A": 151.96, "E": [ 0.25553,  1.53810,  1.62710,  1.77610], "C": [0,    1441.75,    157.297,   -294.138,   -635.871,    22.6733], "D": [0,    1578.80,    30.4702,   -121.116,   -208.093,    2.06445], "B": [0,    33.3800,    19.0022,    329.215,    606.840,    11.7189], "RHO": 5.264},
    {"Name": "Gd", "A": 157.25, "E": [ 0.24681,  1.47840,  1.56320,  1.71170], "C": [0,    1487.15,    162.840,    27.3082,   -601.702,    23.4688], "D": [0,    1695.51,    32.6808,   -16.4958,   -206.047,    2.18022], "B": [0,    34.0815,    19.4743,    86.8769,    560.165,    12.0984], "RHO": 7.900},
    {"Name": "Tb", "A": 158.93, "E": [ 0.23841,  1.42230,  1.50230,  1.64970], "C": [0,    1600.64,    172.736,   -763.092,   -660.625,    24.8412], "D": [0,    1942.85,    35.7782,   -294.928,   -234.360,    2.31598], "B": [0,    32.8576,    20.2868,    656.224,    589.543,    12.7283], "RHO": 8.230},
    {"Name": "Dy", "A": 162.50, "E": [ 0.23048,  1.36920,  1.44450,  1.59160], "C": [0,    1637.50,    180.903,   -1844.25,   -647.375,    26.0305], "D": [0,    2014.59,    38.8543,   -692.601,   -239.902,    2.47707], "B": [0,    36.2102,    20.7939,    1396.10,    561.793,    13.1044], "RHO": 8.540},
    {"Name": "Ho", "A": 164.93, "E": [ 0.22291,  1.31900,  1.39050,  1.53680], "C": [0,    1700.38,    190.786,   -236.654,   -775.993,    27.1625], "D": [0,    2139.79,    42.4069,   -130.892,   -294.370,    2.59224], "B": [0,    38.7067,    21.4583,    256.709,    639.439,    13.8892], "RHO": 8.790},
    {"Name": "Er", "A": 167.26, "E": [ 0.21567,  1.27060,  1.33860,  1.48350], "C": [0,    1741.90,    201.122,   -87.4651,   -813.925,    28.3534], "D": [0,    2204.77,    46.1622,   -81.2009,   -319.583,    2.71036], "B": [0,    43.3274,    22.1148,    155.634,    648.864,    14.6919], "RHO": 9.066},
    {"Name": "Tm", "A": 168.93, "E": [ 0.20880,  1.22500,  1.28920,  1.43340], "C": [0,    1903.03,    214.449,   -235.172,   -1369.48,    29.8450], "D": [0,    2626.20,    51.7088,   -145.845,   -536.453,    2.88786], "B": [0,    39.5541,    22.3906,    248.579,    1008.60,    15.4751], "RHO": 9.320},
    {"Name": "Yb", "A": 173.04, "E": [ 0.20224,  1.18180,  1.24280,  1.38620], "C": [0,    1936.89,    222.415,   -62.1958,   -598.504,    31.1568], "D": [0,    2709.90,    55.1046,   -82.0055,   -265.346,    3.07588], "B": [0,    43.1893,    23.2396,    139.749,    469.237,    15.7601], "RHO": 6.900},
    {"Name": "Lu", "A": 174.67, "E": [ 0.19585,  1.14020,  1.19850,  1.34050], "C": [0,    2117.96,    234.269,   -129.083,   -659.272,    32.7904], "D": [0,    3216.34,    59.9631,   -117.952,   -301.311,    3.29733], "B": [0,    38.6102,    24.2864,    178.332,    495.223,    16.4907], "RHO": 9.841},
    {"Name": "Hf", "A": 178.49, "E": [ 0.18982,  1.09970,  1.15480,  1.29720], "C": [0,    2161.00,    245.205,    5.61520,   -670.726,    34.2641], "D": [0,    3329.92,    65.2298,   -66.4509,   -318.136,    3.50037], "B": [0,    42.0839,    24.6617,    99.6991,    489.335,    16.9051], "RHO": 13.310},
    {"Name": "Ta", "A": 180.95, "E": [ 0.18394,  1.06130,  1.11370,  1.25530], "C": [0,    2255.10,    257.481,    111.510,   -715.155,    35.9914], "D": [0,    3582.97,    70.7610,   -5.21381,   -350.262,    3.73694], "B": [0,    43.4004,    25.4672,    65.2315,    503.202,    17.5158], "RHO": 16.654},
    {"Name":  "W", "A": 183.85, "E": [ 0.17837,  1.02467,  1.07450,  1.21550], "C": [0,    2302.14,    269.541,    26.0647,   -679.707,    37.6904], "D": [0,    3708.71,    76.5534,   -51.0738,   -348.803,    3.98300], "B": [0,    48.1163,    26.2978,    111.746,    470.648,    18.1148], "RHO": 19.250},
    {"Name": "Re", "A": 186.21, "E": [ 0.17302,  0.98940,  1.03710,  1.17730], "C": [0,    2358.97,    285.208,    188.210,    143.744,    39.4396], "D": [0,    3830.39,    84.6447,    25.3235,    20.8676,    4.23639], "B": [0,    52.2222,    26.4219,    33.7986,    18.2935,    18.8788], "RHO": 21.020},
    {"Name": "Os", "A": 190.20, "E": [ 0.16787,  0.95580,  1.00140,  1.14080], "C": [0,    2387.85,    294.667,    316.100,    159.730,    40.7568], "D": [0,    3918.38,    89.4549,    88.0864,    27.2606,    4.42033], "B": [0,    57.1405,    27.5603,   -24.9957,    13.2600,    19.6066], "RHO": 22.590},
    {"Name": "Ir", "A": 192.22, "E": [ 0.16292,  0.92360,  0.96710,  1.10580], "C": [0,    2741.13,    309.232,    174.403,    173.285,    42.7214], "D": [0,    5131.10,    96.8053,    13.4908,    32.0192,    4.70072], "B": [0,    42.4562,    28.6286,    50.7349,    10.6780,    20.4232], "RHO": 22.560},
    {"Name": "Pt", "A": 195.08, "E": [ 0.15818,  0.89310,  0.93414,  1.07230], "C": [0,    3254.31,    325.669,    398.469,    160.876,    44.4118], "D": [0,    7100.60,    106.445,    128.985,    23.8468,    4.93040], "B": [0,    18.7399,    28.8650,   -49.9764,    20.6343,    21.2905], "RHO": 21.450},
    {"Name": "Au", "A": 196.97, "E": [ 0.15359,  0.86376,  0.90259,  1.04000], "C": [0,    2537.42,    340.917,    89.8451,    64.5149,    46.5526], "D": [0,    4376.37,    114.408,   -44.5853,   -28.9612,    5.24640], "B": [0,    75.1939,    30.0612,    95.9660,    70.7923,    22.1362], "RHO": 19.320},
    {"Name": "Hg", "A": 200.59, "E": [ 0.14918,  0.83530,  0.87220,  1.00910], "C": [0,    2525.13,    353.446,    489.044,    138.719,    48.3240], "D": [0,    4288.63,    121.874,    183.680,    6.84890,    5.52874], "B": [0,    83.2618,    31.1820,   -71.6323,    37.9963,    22.8528], "RHO": 13.534},
    {"Name": "Tl", "A": 204.38, "E": [ 0.14495,  0.80810,  0.84340,  0.97930], "C": [0,    2658.55,    367.268,    278.709,    252.684,    50.0446], "D": [0,    4816.85,    130.669,    61.3652,    67.9382,    5.79648], "B": [0,    82.3422,    31.9902,    25.4070,   -9.97393,    23.5810], "RHO": 11.850},
    {"Name": "Pb", "A": 207.20, "E": [ 0.14088,  0.78196,  0.81538,  0.95073], "C": [0,    2571.84,    389.215,    384.986,    190.910,    51.5986], "D": [0,    4397.98,    146.250,    122.566,    32.4178,    5.99873], "B": [0,    95.8287,    31.6502,   -12.8137,    22.5216,    24.8659], "RHO": 11.340},
    {"Name": "Bi", "A": 208.98, "E": [ 0.13694,  0.75710,  0.78870,  0.92340], "C": [0,    2846.11,    402.366,    370.643,    133.736,    54.0287], "D": [0,    5431.10,    153.120,    114.077,   -4.43436,    6.40580], "B": [0,    88.5244,    34.1060,    1.89787,    50.8520,    25.7828], "RHO": 9.780}
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
    var MoR_S = L*L*L*(E.C[typeEdge+1] - L*E.D[typeEdge+1]) + Z/E.A*NSigmaKN + L*L*E.B[typeEdge+1];
    var MoR_L = L*L*L*(E.C[typeEdge+2] - L*E.D[typeEdge+2]) + Z/E.A*NSigmaKN + L*L*E.B[typeEdge+2];
    return [MoR_S, MoR_L];
}

function getMoR(Z, L) {
    if (Z<1) return 0.0;
    var E = elements[Z];
    var NSigmaKN = calcNSigmaKN(L);
    var i = 0;
    if (E.E[0] < 0 || L <= E.E[0]) i = 1; // shorter than K-edge
    else if (E.E[1] < 0 || L <= E.E[1]) i = 2; // shorter than L1-edge
    else if (E.E[2] < 0 || L <= E.E[2]) i = 3; // shorter than L2-edge
    else if (E.E[3] < 0 || L <= E.E[3]) i = 4; // shorter than L3-edge
    else i = 5; // longer than L3-edge
    return L*L*L*(E.C[i] - L*E.D[i]) + Z/E.A*NSigmaKN + L*L*E.B[i];
}

function getRhoByZ(Z) {
    return elements[Z].RHO;
}
