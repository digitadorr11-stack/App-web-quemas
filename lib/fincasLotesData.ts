export interface LoteInfo {
  lote: string;
  area: number;
  tch: number;
  tons: number;
  variedad?: string;
  tipoCosecha?: string;
}

export interface FincaInfo {
  name: string;
  code?: string;
  lotes: LoteInfo[];
}

export const FINCAS_LOTES_DATA: FincaInfo[] = [
  {
    "name": "AGRICOLA BELLA VISTA",
    "code": "605",
    "lotes": [
      {
        "lote": "15.04",
        "area": 7.6,
        "tch": 112.68,
        "tons": 856,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.05",
        "area": 5.2,
        "tch": 136.25,
        "tons": 708,
        "variedad": "CG00-102",
        "tipoCosecha": ""
      },
      {
        "lote": "15.03",
        "area": 8,
        "tch": 93.73,
        "tons": 750,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.02",
        "area": 7.87,
        "tch": 88.61,
        "tons": 697,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.01",
        "area": 9.8,
        "tch": 111.97,
        "tons": 1097,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.01",
        "area": 11,
        "tch": 80.35,
        "tons": 884,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.04",
        "area": 3.36,
        "tch": 108.41,
        "tons": 364,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.11",
        "area": 11.24,
        "tch": 90.41,
        "tons": 1016,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.12",
        "area": 9.5,
        "tch": 98.02,
        "tons": 931,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.1",
        "area": 2,
        "tch": 158.27,
        "tons": 317,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.09",
        "area": 9.97,
        "tch": 92.17,
        "tons": 919,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.05",
        "area": 6.31,
        "tch": 91.86,
        "tons": 580,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.06",
        "area": 5.97,
        "tch": 66.79,
        "tons": 399,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.07",
        "area": 8.05,
        "tch": 93.01,
        "tons": 749,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.02",
        "area": 9.88,
        "tch": 91.67,
        "tons": 906,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.08",
        "area": 10.5,
        "tch": 108.1,
        "tons": 1135,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.03",
        "area": 5.93,
        "tch": 111.69,
        "tons": 662,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "7.01",
        "area": 12.71,
        "tch": 105.49,
        "tons": 1341,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "14.01",
        "area": 9.05,
        "tch": 103.31,
        "tons": 935,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.06",
        "area": 6.46,
        "tch": 130.33,
        "tons": 842,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.09",
        "area": 8,
        "tch": 92.57,
        "tons": 741,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.02",
        "area": 4.33,
        "tch": 103.35,
        "tons": 447,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.14",
        "area": 4.77,
        "tch": 122.84,
        "tons": 586,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "15.15",
        "area": 8.29,
        "tch": 131.65,
        "tons": 1091,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "15.16",
        "area": 3.7,
        "tch": 120.6,
        "tons": 446,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "15.11",
        "area": 7.72,
        "tch": 144.28,
        "tons": 1114,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.13",
        "area": 11.08,
        "tch": 138.5,
        "tons": 1535,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "15.17",
        "area": 5.22,
        "tch": 131.38,
        "tons": 686,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "3.07",
        "area": 4.19,
        "tch": 56.11,
        "tons": 235,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.03",
        "area": 4.19,
        "tch": 103.92,
        "tons": 435,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.08",
        "area": 0.58,
        "tch": 104.52,
        "tons": 61,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.04",
        "area": 4.19,
        "tch": 139.13,
        "tons": 583,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "7.02",
        "area": 6,
        "tch": 92.19,
        "tons": 553,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.01",
        "area": 2.81,
        "tch": 146.67,
        "tons": 412,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.02",
        "area": 2.39,
        "tch": 179.96,
        "tons": 430,
        "variedad": "CP72-2086",
        "tipoCosecha": ""
      },
      {
        "lote": "13.03",
        "area": 4.34,
        "tch": 142,
        "tons": 616,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.18",
        "area": 4.51,
        "tch": 143.52,
        "tons": 647,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "3.05",
        "area": 3.5,
        "tch": 60.45,
        "tons": 212,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.09",
        "area": 2.97,
        "tch": 191.99,
        "tons": 570,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.07",
        "area": 6.61,
        "tch": 87.45,
        "tons": 578,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.08",
        "area": 2.39,
        "tch": 72.07,
        "tons": 172,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.06",
        "area": 3.5,
        "tch": 142.55,
        "tons": 499,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.19",
        "area": 3.88,
        "tch": 161.53,
        "tons": 627,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "15.2",
        "area": 5.15,
        "tch": 111.81,
        "tons": 576,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "12.01",
        "area": 4.19,
        "tch": 53.61,
        "tons": 225,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "15.1",
        "area": 7.13,
        "tch": 148.01,
        "tons": 1055,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.12",
        "area": 3.13,
        "tch": 175.23,
        "tons": 548,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "7.04",
        "area": 3.84,
        "tch": 109.35,
        "tons": 420,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.07",
        "area": 1.28,
        "tch": 103.77,
        "tons": 133,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.08",
        "area": 9.55,
        "tch": 98.94,
        "tons": 945,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.09",
        "area": 6.64,
        "tch": 121.58,
        "tons": 807,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.02",
        "area": 3.6,
        "tch": 130.57,
        "tons": 470,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.1",
        "area": 2,
        "tch": 68.15,
        "tons": 136,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "3.09",
        "area": 1.4,
        "tch": 55.43,
        "tons": 78,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.13",
        "area": 6,
        "tch": 98.39,
        "tons": 590,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.05",
        "area": 6,
        "tch": 116.84,
        "tons": 701,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.04",
        "area": 6.4,
        "tch": 127.35,
        "tons": 815,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.04",
        "area": 1.4,
        "tch": 114.5,
        "tons": 160,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.06",
        "area": 7.27,
        "tch": 92.29,
        "tons": 671,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.03",
        "area": 2,
        "tch": 103.84,
        "tons": 208,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.05",
        "area": 7.73,
        "tch": 119.26,
        "tons": 922,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.06",
        "area": 4.19,
        "tch": 124.26,
        "tons": 521,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.01",
        "area": 8,
        "tch": 167.27,
        "tons": 1338,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.01",
        "area": 7.5,
        "tch": 124.77,
        "tons": 936,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "7.03",
        "area": 10,
        "tch": 112.66,
        "tons": 1127,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.06",
        "area": 7.5,
        "tch": 130.71,
        "tons": 980,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.09",
        "area": 7.5,
        "tch": 141.83,
        "tons": 1064,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.08",
        "area": 5.8,
        "tch": 136,
        "tons": 789,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "14.02",
        "area": 10,
        "tch": 100.89,
        "tons": 1009,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.07",
        "area": 7,
        "tch": 144.24,
        "tons": 1010,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.1",
        "area": 8.38,
        "tch": 116.01,
        "tons": 972,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "14.03",
        "area": 12.7,
        "tch": 108.95,
        "tons": 1384,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 4,
        "tch": 142.82,
        "tons": 571,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "7.06",
        "area": 2,
        "tch": 95.14,
        "tons": 190,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.01",
        "area": 4,
        "tch": 93.64,
        "tons": 375,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.13",
        "area": 4.19,
        "tch": 119.22,
        "tons": 500,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.12",
        "area": 5.56,
        "tch": 116.14,
        "tons": 646,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.11",
        "area": 5.54,
        "tch": 125.29,
        "tons": 694,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.07",
        "area": 3.5,
        "tch": 114.26,
        "tons": 400,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.04",
        "area": 5.94,
        "tch": 61.92,
        "tons": 368,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.11",
        "area": 5.87,
        "tch": 105.75,
        "tons": 621,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.08",
        "area": 1.75,
        "tch": 66.37,
        "tons": 116,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.02",
        "area": 11.88,
        "tch": 107.18,
        "tons": 1273,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "13.1",
        "area": 8.24,
        "tch": 127.99,
        "tons": 1055,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.06",
        "area": 3.5,
        "tch": 102.68,
        "tons": 359,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.05",
        "area": 2.7,
        "tch": 89.91,
        "tons": 243,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.01",
        "area": 18.5,
        "tch": 112.5,
        "tons": 2081,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.02",
        "area": 2.79,
        "tch": 98.95,
        "tons": 276,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.01",
        "area": 11,
        "tch": 112.94,
        "tons": 1242,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "16.15",
        "area": 7.27,
        "tch": 154.03,
        "tons": 1120,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.13",
        "area": 7.15,
        "tch": 131.01,
        "tons": 937,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.12",
        "area": 7.37,
        "tch": 134.18,
        "tons": 989,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.09",
        "area": 9.84,
        "tch": 78.63,
        "tons": 774,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.08",
        "area": 9.8,
        "tch": 89.91,
        "tons": 881,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.05",
        "area": 10.08,
        "tch": 95.52,
        "tons": 963,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.04",
        "area": 9.89,
        "tch": 118.97,
        "tons": 1177,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.01",
        "area": 9.18,
        "tch": 95.24,
        "tons": 874,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "8.01",
        "area": 3.5,
        "tch": 62.59,
        "tons": 219,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.03",
        "area": 6.47,
        "tch": 99.81,
        "tons": 646,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "17.01",
        "area": 1.75,
        "tch": 62.81,
        "tons": 110,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "17.02",
        "area": 9.3,
        "tch": 91.13,
        "tons": 848,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "17.03",
        "area": 7.27,
        "tch": 92.46,
        "tons": 672,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "3.04",
        "area": 4,
        "tch": 95.55,
        "tons": 382,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.02",
        "area": 3.5,
        "tch": 95.84,
        "tons": 335,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.08",
        "area": 12,
        "tch": 87.1,
        "tons": 1045,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.07",
        "area": 4.19,
        "tch": 90.79,
        "tons": 380,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "17.04",
        "area": 2,
        "tch": 73.97,
        "tons": 148,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "17.05",
        "area": 1.4,
        "tch": 85.83,
        "tons": 120,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "17.06",
        "area": 1,
        "tch": 104.39,
        "tons": 104,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "17.07",
        "area": 1,
        "tch": 174.91,
        "tons": 175,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "17.08",
        "area": 8.14,
        "tch": 77.34,
        "tons": 630,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "17.09",
        "area": 4.61,
        "tch": 63.75,
        "tons": 294,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "10.02",
        "area": 9,
        "tch": 93.59,
        "tons": 842,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.02",
        "area": 4,
        "tch": 47.02,
        "tons": 188,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "16.14",
        "area": 7.64,
        "tch": 135.08,
        "tons": 1032,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.11",
        "area": 11.23,
        "tch": 123.99,
        "tons": 1392,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.1",
        "area": 10.68,
        "tch": 112.44,
        "tons": 1201,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.07",
        "area": 11.51,
        "tch": 126.55,
        "tons": 1457,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.06",
        "area": 10.77,
        "tch": 100.3,
        "tons": 1080,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.03",
        "area": 8.47,
        "tch": 134.44,
        "tons": 1139,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.02",
        "area": 9.31,
        "tch": 103.46,
        "tons": 963,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "AGRICOLA EL REFUGIO",
    "code": "231",
    "lotes": [
      {
        "lote": "1.01",
        "area": 8.81,
        "tch": 43.22,
        "tons": 381,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.02",
        "area": 10.9,
        "tch": 75.12,
        "tons": 819,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.04",
        "area": 7.05,
        "tch": 98.42,
        "tons": 694,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.05",
        "area": 4.61,
        "tch": 34.4,
        "tons": 159,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.06",
        "area": 1.49,
        "tch": 47.93,
        "tons": 71,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.01",
        "area": 6.94,
        "tch": 36.1,
        "tons": 251,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.02",
        "area": 1.58,
        "tch": 60.6,
        "tons": 96,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.03",
        "area": 2.13,
        "tch": 13.68,
        "tons": 29,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.04",
        "area": 3.79,
        "tch": 13.88,
        "tons": 53,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.05",
        "area": 6.17,
        "tch": 94.53,
        "tons": 583,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.08",
        "area": 5.67,
        "tch": 49.36,
        "tons": 280,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.09",
        "area": 3.82,
        "tch": 102.38,
        "tons": 391,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1",
        "area": 6.99,
        "tch": 53.68,
        "tons": 375,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.11",
        "area": 3.1,
        "tch": 42.32,
        "tons": 131,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.01",
        "area": 2.8,
        "tch": 40.81,
        "tons": 114,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.02",
        "area": 7.89,
        "tch": 48.63,
        "tons": 384,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.03",
        "area": 5.75,
        "tch": 19.67,
        "tons": 113,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.04",
        "area": 3.68,
        "tch": 36.25,
        "tons": 133,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.05",
        "area": 9.74,
        "tch": 47.26,
        "tons": 460,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.06",
        "area": 4.3,
        "tch": 26.25,
        "tons": 113,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.07",
        "area": 5.08,
        "tch": 51.84,
        "tons": 263,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.08",
        "area": 9.92,
        "tch": 33.73,
        "tons": 335,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.09",
        "area": 5.33,
        "tch": 40.75,
        "tons": 217,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "AGROCAÑA",
    "code": "587",
    "lotes": [
      {
        "lote": "3.04",
        "area": 3.5,
        "tch": 135.06,
        "tons": 473,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.03",
        "area": 1.1,
        "tch": 158.66,
        "tons": 175,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.02",
        "area": 5.5,
        "tch": 112.02,
        "tons": 616,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.06",
        "area": 1.47,
        "tch": 111.93,
        "tons": 165,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.07",
        "area": 2.16,
        "tch": 93.62,
        "tons": 202,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.04",
        "area": 2.34,
        "tch": 85.31,
        "tons": 200,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.05",
        "area": 0.55,
        "tch": 144.61,
        "tons": 80,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.08",
        "area": 2.36,
        "tch": 93.62,
        "tons": 221,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.01",
        "area": 2.13,
        "tch": 93.62,
        "tons": 199,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.02",
        "area": 0.12,
        "tch": 123.25,
        "tons": 15,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.03",
        "area": 2.45,
        "tch": 93.62,
        "tons": 229,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.07",
        "area": 5,
        "tch": 121.53,
        "tons": 608,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.05",
        "area": 5,
        "tch": 169.95,
        "tons": 850,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.06",
        "area": 4.38,
        "tch": 116.39,
        "tons": 510,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.34",
        "area": 1.18,
        "tch": 84.42,
        "tons": 100,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.02",
        "area": 3.37,
        "tch": 84.42,
        "tons": 285,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.33",
        "area": 2.57,
        "tch": 84.42,
        "tons": 217,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.21",
        "area": 0.45,
        "tch": 108.6,
        "tons": 49,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.32",
        "area": 0.36,
        "tch": 384.1,
        "tons": 38,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.22",
        "area": 0.63,
        "tch": 76.73,
        "tons": 48,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.01",
        "area": 7.56,
        "tch": 169.31,
        "tons": 1280,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.12",
        "area": 5.75,
        "tch": 89.02,
        "tons": 512,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.14",
        "area": 9.11,
        "tch": 89.02,
        "tons": 811,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.13",
        "area": 5,
        "tch": 89.02,
        "tons": 445,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.06",
        "area": 2,
        "tch": 171.48,
        "tons": 69,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.05",
        "area": 9.64,
        "tch": 89.02,
        "tons": 858,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.11",
        "area": 2.4,
        "tch": 70.15,
        "tons": 168,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.08",
        "area": 0.3,
        "tch": 112.02,
        "tons": 34,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "10.01",
        "area": 2.45,
        "tch": 139.1,
        "tons": 341,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.05",
        "area": 1.45,
        "tch": 98.48,
        "tons": 143,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.13",
        "area": 1.47,
        "tch": 84.42,
        "tons": 124,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.14",
        "area": 1.44,
        "tch": 84.42,
        "tons": 122,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.13",
        "area": 0.48,
        "tch": 93.17,
        "tons": 45,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.09",
        "area": 0.16,
        "tch": 138.44,
        "tons": 22,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.12",
        "area": 2.46,
        "tch": 78.98,
        "tons": 194,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.11",
        "area": 2.35,
        "tch": 84.42,
        "tons": 198,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.15",
        "area": 1.39,
        "tch": 84.42,
        "tons": 117,
        "variedad": "CR87-339",
        "tipoCosecha": ""
      },
      {
        "lote": "9.1",
        "area": 0.82,
        "tch": 106.44,
        "tons": 87,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.14",
        "area": 0.38,
        "tch": 126.84,
        "tons": 48,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.16",
        "area": 2.85,
        "tch": 84.42,
        "tons": 241,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.01",
        "area": 0.32,
        "tch": 184.41,
        "tons": 59,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.11",
        "area": 10.55,
        "tch": 84.42,
        "tons": 891,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.15",
        "area": 3.98,
        "tch": 71.64,
        "tons": 48,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.24",
        "area": 1.11,
        "tch": 84.42,
        "tons": 94,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.25",
        "area": 1.09,
        "tch": 103.06,
        "tons": 112,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.07",
        "area": 0.5,
        "tch": 275.24,
        "tons": 138,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.08",
        "area": 1.17,
        "tch": 84.42,
        "tons": 99,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.17",
        "area": 1.66,
        "tch": 84.42,
        "tons": 140,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.2",
        "area": 0.82,
        "tch": 84.42,
        "tons": 69,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.28",
        "area": 0.87,
        "tch": 84.42,
        "tons": 73,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.09",
        "area": 2.43,
        "tch": 84.42,
        "tons": 205,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.18",
        "area": 6.67,
        "tch": 84.42,
        "tons": 563,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.19",
        "area": 4.9,
        "tch": 84.42,
        "tons": 414,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.2",
        "area": 3.33,
        "tch": 100.22,
        "tons": 334,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.21",
        "area": 6.65,
        "tch": 56.91,
        "tons": 378,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.17",
        "area": 2.57,
        "tch": 84.42,
        "tons": 217,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.16",
        "area": 2.23,
        "tch": 84.42,
        "tons": 188,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.26",
        "area": 1.55,
        "tch": 84.42,
        "tons": 131,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.04",
        "area": 1.29,
        "tch": 84.42,
        "tons": 109,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.05",
        "area": 0.5,
        "tch": 84.42,
        "tons": 42,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.06",
        "area": 1.57,
        "tch": 84.42,
        "tons": 133,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.27",
        "area": 2.76,
        "tch": 84.42,
        "tons": 233,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.38",
        "area": 0.71,
        "tch": 84.42,
        "tons": 60,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.29",
        "area": 0.94,
        "tch": 84.42,
        "tons": 79,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.3",
        "area": 0.87,
        "tch": 84.42,
        "tons": 73,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.31",
        "area": 7.3,
        "tch": 70.58,
        "tons": 207,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.01",
        "area": 2.43,
        "tch": 152.82,
        "tons": 188,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.02",
        "area": 1.24,
        "tch": 84.42,
        "tons": 105,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.03",
        "area": 0.5,
        "tch": 86.4,
        "tons": 43,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.36",
        "area": 1.5,
        "tch": 84.42,
        "tons": 127,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.37",
        "area": 1.27,
        "tch": 84.42,
        "tons": 107,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.23",
        "area": 0.45,
        "tch": 95.71,
        "tons": 43,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.41",
        "area": 0.4,
        "tch": 84.42,
        "tons": 34,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.1",
        "area": 2.2,
        "tch": 49.26,
        "tons": 62,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.12",
        "area": 1.24,
        "tch": 86.96,
        "tons": 108,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.16",
        "area": 1.3,
        "tch": 82.22,
        "tons": 107,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.1",
        "area": 2.04,
        "tch": 87.14,
        "tons": 178,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.11",
        "area": 1.72,
        "tch": 135.02,
        "tons": 117,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.12",
        "area": 2.16,
        "tch": 113.08,
        "tons": 244,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.22",
        "area": 6.71,
        "tch": 97.32,
        "tons": 653,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.24",
        "area": 4.15,
        "tch": 99.17,
        "tons": 412,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.25",
        "area": 1.18,
        "tch": 84.42,
        "tons": 100,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.26",
        "area": 1.16,
        "tch": 93.9,
        "tons": 109,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.2",
        "area": 5,
        "tch": 93.62,
        "tons": 468,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.11",
        "area": 5.22,
        "tch": 118.88,
        "tons": 621,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.21",
        "area": 2.98,
        "tch": 118.39,
        "tons": 353,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.22",
        "area": 3,
        "tch": 93.62,
        "tons": 281,
        "variedad": "CP72-2086",
        "tipoCosecha": ""
      },
      {
        "lote": "2.23",
        "area": 1,
        "tch": 60.26,
        "tons": 60,
        "variedad": "CP72-2086",
        "tipoCosecha": ""
      },
      {
        "lote": "2.08",
        "area": 8,
        "tch": 118.95,
        "tons": 797,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.03",
        "area": 3.14,
        "tch": 88.04,
        "tons": 276,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.04",
        "area": 2,
        "tch": 323.11,
        "tons": 646,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.03",
        "area": 3.77,
        "tch": 122.77,
        "tons": 463,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.14",
        "area": 1.88,
        "tch": 84.42,
        "tons": 159,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.02",
        "area": 12,
        "tch": 127.15,
        "tons": 1526,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.1",
        "area": 2.37,
        "tch": 180,
        "tons": 427,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.14",
        "area": 5.74,
        "tch": 76.57,
        "tons": 440,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.39",
        "area": 1.81,
        "tch": 138.69,
        "tons": 49,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.4",
        "area": 3.53,
        "tch": 52.12,
        "tons": 184,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.13",
        "area": 2.4,
        "tch": 123.61,
        "tons": 297,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.08",
        "area": 5.25,
        "tch": 61.88,
        "tons": 62,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.01",
        "area": 12,
        "tch": 100.59,
        "tons": 136,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.02",
        "area": 17,
        "tch": 87.22,
        "tons": 611,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.01",
        "area": 3.4,
        "tch": 182.7,
        "tons": 371,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.09",
        "area": 4,
        "tch": 137.15,
        "tons": 411,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.19",
        "area": 3.66,
        "tch": 103.95,
        "tons": 380,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.2",
        "area": 1.55,
        "tch": 74.06,
        "tons": 115,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.29",
        "area": 3.99,
        "tch": 94.19,
        "tons": 376,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.04",
        "area": 6.5,
        "tch": 72.89,
        "tons": 474,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.03",
        "area": 6.32,
        "tch": 78.85,
        "tons": 498,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.19",
        "area": 9.98,
        "tch": 119.02,
        "tons": 1188,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.06",
        "area": 6.43,
        "tch": 113.86,
        "tons": 732,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.35",
        "area": 1.76,
        "tch": 99.12,
        "tons": 174,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.04",
        "area": 2.37,
        "tch": 66.39,
        "tons": 157,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.17",
        "area": 8.44,
        "tch": 113.44,
        "tons": 957,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.09",
        "area": 1,
        "tch": 281.3,
        "tons": 281,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.18",
        "area": 6.4,
        "tch": 129.61,
        "tons": 830,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.22",
        "area": 1.33,
        "tch": 25,
        "tons": 33,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.07",
        "area": 3,
        "tch": 216.66,
        "tons": 650,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.03",
        "area": 3.41,
        "tch": 150.75,
        "tons": 514,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.07",
        "area": 2,
        "tch": 150.15,
        "tons": 110,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "7.01",
        "area": 5.5,
        "tch": 87.67,
        "tons": 307,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.05",
        "area": 2.96,
        "tch": 70.78,
        "tons": 210,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.23",
        "area": 2.16,
        "tch": 106.05,
        "tons": 229,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.3",
        "area": 1.22,
        "tch": 203.81,
        "tons": 249,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.14",
        "area": 5.85,
        "tch": 140.96,
        "tons": 825,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.24",
        "area": 5.5,
        "tch": 98.29,
        "tons": 541,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.13",
        "area": 0.95,
        "tch": 150.44,
        "tons": 143,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.17",
        "area": 0.87,
        "tch": 78.29,
        "tons": 68,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.06",
        "area": 2.36,
        "tch": 71,
        "tons": 168,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.07",
        "area": 0.65,
        "tch": 35.37,
        "tons": 23,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.08",
        "area": 1,
        "tch": 125.37,
        "tons": 125,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.18",
        "area": 5.7,
        "tch": 94.27,
        "tons": 537,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.06",
        "area": 2.8,
        "tch": 98.63,
        "tons": 276,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 2.25,
        "tch": 124.96,
        "tons": 281,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.25",
        "area": 3,
        "tch": 102.82,
        "tons": 308,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.26",
        "area": 6.08,
        "tch": 102.91,
        "tons": 370,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.21",
        "area": 3,
        "tch": 85.16,
        "tons": 255,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "11.15",
        "area": 0.4,
        "tch": 164.2,
        "tons": 66,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.07",
        "area": 8,
        "tch": 157.49,
        "tons": 1199,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.04",
        "area": 1.4,
        "tch": 80.36,
        "tons": 113,
        "variedad": "CP72-2086",
        "tipoCosecha": ""
      },
      {
        "lote": "2.09",
        "area": 5.18,
        "tch": 84.42,
        "tons": 437,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "2.1",
        "area": 3,
        "tch": 125.44,
        "tons": 376,
        "variedad": "CP72-2086",
        "tipoCosecha": ""
      },
      {
        "lote": "2.14",
        "area": 3.3,
        "tch": 93.62,
        "tons": 309,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "2.15",
        "area": 7.3,
        "tch": 93.62,
        "tons": 683,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "2.18",
        "area": 1.25,
        "tch": 93.62,
        "tons": 117,
        "variedad": "CGMex10-26315",
        "tipoCosecha": ""
      },
      {
        "lote": "2.19",
        "area": 2.35,
        "tch": 93.62,
        "tons": 220,
        "variedad": "CGMex10-26315",
        "tipoCosecha": ""
      },
      {
        "lote": "12.09",
        "area": 2.27,
        "tch": 70.12,
        "tons": 159,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.04",
        "area": 4.4,
        "tch": 61.32,
        "tons": 270,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.03",
        "area": 2.2,
        "tch": 131.78,
        "tons": 290,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.08",
        "area": 3.99,
        "tch": 89.02,
        "tons": 355,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.12",
        "area": 8,
        "tch": 93.62,
        "tons": 749,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "2.13",
        "area": 0.9,
        "tch": 93.62,
        "tons": 84,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "12.1",
        "area": 2.5,
        "tch": 128.01,
        "tons": 320,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.05",
        "area": 2.66,
        "tch": 44.53,
        "tons": 118,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.07",
        "area": 4,
        "tch": 82.24,
        "tons": 329,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.01",
        "area": 2.57,
        "tch": 89.89,
        "tons": 231,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.03",
        "area": 2.76,
        "tch": 136.58,
        "tons": 377,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.09",
        "area": 2.33,
        "tch": 134.97,
        "tons": 314,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.06",
        "area": 0.86,
        "tch": 79.76,
        "tons": 69,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.02",
        "area": 3.05,
        "tch": 115.1,
        "tons": 351,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.04",
        "area": 2.09,
        "tch": 68.46,
        "tons": 143,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.1",
        "area": 4.22,
        "tch": 130.53,
        "tons": 551,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.09",
        "area": 6.65,
        "tch": 122.93,
        "tons": 203,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.01",
        "area": 6.5,
        "tch": 173.7,
        "tons": 1129,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.27",
        "area": 1.88,
        "tch": 112.32,
        "tons": 211,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.28",
        "area": 1.48,
        "tch": 80.89,
        "tons": 120,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.09",
        "area": 1.8,
        "tch": 112.02,
        "tons": 202,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "2.11",
        "area": 1.5,
        "tch": 90.94,
        "tons": 91,
        "variedad": "CP72-2086",
        "tipoCosecha": ""
      },
      {
        "lote": "2.16",
        "area": 1.23,
        "tch": 93.62,
        "tons": 115,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "2.17",
        "area": 1.87,
        "tch": 93.62,
        "tons": 175,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "10.07",
        "area": 8.62,
        "tch": 110.44,
        "tons": 952,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.08",
        "area": 6.75,
        "tch": 81.21,
        "tons": 548,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "12.18",
        "area": 4.32,
        "tch": 73.23,
        "tons": 316,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.11",
        "area": 2,
        "tch": 131.6,
        "tons": 263,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.13",
        "area": 3.99,
        "tch": 86.54,
        "tons": 345,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.12",
        "area": 4.18,
        "tch": 78.68,
        "tons": 329,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.15",
        "area": 2.79,
        "tch": 122.7,
        "tons": 342,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.16",
        "area": 5.99,
        "tch": 109.92,
        "tons": 658,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.11",
        "area": 0.79,
        "tch": 112.27,
        "tons": 89,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "BANDURRIA",
    "code": "367",
    "lotes": [
      {
        "lote": "6.1",
        "area": 25.01,
        "tch": 129.58,
        "tons": 3241,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.11",
        "area": 10.47,
        "tch": 141.44,
        "tons": 1481,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.12",
        "area": 2.69,
        "tch": 125.19,
        "tons": 337,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.13",
        "area": 9.09,
        "tch": 109.36,
        "tons": 994,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.14",
        "area": 7.56,
        "tch": 125.97,
        "tons": 952,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.2",
        "area": 8.55,
        "tch": 165.79,
        "tons": 1417,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.21",
        "area": 8.58,
        "tch": 149.34,
        "tons": 1281,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.22",
        "area": 11.43,
        "tch": 149.35,
        "tons": 1707,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.23",
        "area": 12.13,
        "tch": 122.81,
        "tons": 1490,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.29",
        "area": 6.53,
        "tch": 107.11,
        "tons": 699,
        "variedad": "CG98-46",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.3",
        "area": 6.83,
        "tch": 127.49,
        "tons": 871,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.31",
        "area": 7.74,
        "tch": 107.11,
        "tons": 829,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.02",
        "area": 12.45,
        "tch": 104.78,
        "tons": 1304,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.03",
        "area": 11.24,
        "tch": 100.99,
        "tons": 1135,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.04",
        "area": 9.2,
        "tch": 107.31,
        "tons": 987,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.05",
        "area": 8.78,
        "tch": 108.16,
        "tons": 950,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.33",
        "area": 8.25,
        "tch": 123.9,
        "tons": 1022,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.09",
        "area": 11.93,
        "tch": 125.25,
        "tons": 1494,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.18",
        "area": 1.99,
        "tch": 131.41,
        "tons": 261,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.19",
        "area": 0.56,
        "tch": 288.91,
        "tons": 162,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.15",
        "area": 13.75,
        "tch": 114.16,
        "tons": 1570,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.16",
        "area": 4.22,
        "tch": 129.65,
        "tons": 547,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.17",
        "area": 6.34,
        "tch": 134.11,
        "tons": 850,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.01",
        "area": 15.21,
        "tch": 120.72,
        "tons": 1836,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.26",
        "area": 11.41,
        "tch": 92.25,
        "tons": 1053,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.27",
        "area": 14.56,
        "tch": 131.92,
        "tons": 1921,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.28",
        "area": 13.82,
        "tch": 127.79,
        "tons": 1766,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.25",
        "area": 21.3,
        "tch": 104.35,
        "tons": 2223,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.24",
        "area": 26.2,
        "tch": 92.33,
        "tons": 2419,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.06",
        "area": 21.48,
        "tch": 132.11,
        "tons": 2838,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.07",
        "area": 16.15,
        "tch": 111.56,
        "tons": 1802,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.08",
        "area": 19.55,
        "tch": 114.11,
        "tons": 2231,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.35",
        "area": 5.76,
        "tch": 116.15,
        "tons": 669,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.34",
        "area": 7.27,
        "tch": 104.88,
        "tons": 762,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.32",
        "area": 6.15,
        "tch": 68.41,
        "tons": 239,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.36",
        "area": 11.05,
        "tch": 149.55,
        "tons": 1653,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "BARRILES INAFEB",
    "code": "532",
    "lotes": [
      {
        "lote": "1.07",
        "area": 20.98,
        "tch": 77.53,
        "tons": 1627,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.13",
        "area": 47.22,
        "tch": 100,
        "tons": 4722,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "1.12",
        "area": 47.44,
        "tch": 80,
        "tons": 3795,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.11",
        "area": 63.93,
        "tch": 100,
        "tons": 6393,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "1.1",
        "area": 51.14,
        "tch": 70,
        "tons": 3580,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "1.06",
        "area": 24.52,
        "tch": 65.07,
        "tons": 406,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "BELEN",
    "code": "8",
    "lotes": [
      {
        "lote": "8.03",
        "area": 18.68,
        "tch": 112.8,
        "tons": 277,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "8.07",
        "area": 35.74,
        "tch": 138.4,
        "tons": 4945,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "8.08",
        "area": 15.61,
        "tch": 129.9,
        "tons": 2028,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte granel en verde"
      },
      {
        "lote": "8.04",
        "area": 40.4,
        "tch": 117.38,
        "tons": 4742,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "8.06",
        "area": 39.02,
        "tch": 93.74,
        "tons": 3655,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "8.01",
        "area": 122.45,
        "tch": 92.43,
        "tons": 11318,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "8.02",
        "area": 57.42,
        "tch": 80.63,
        "tons": 4629,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "8.09",
        "area": 4.99,
        "tch": 83.07,
        "tons": 115,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "8.05",
        "area": 114.12,
        "tch": 120.78,
        "tons": 205,
        "variedad": "Varias",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "BELEN ANEXO",
    "code": "81",
    "lotes": [
      {
        "lote": "81.01",
        "area": 3.03,
        "tch": 100.82,
        "tons": 305,
        "variedad": "Varias",
        "tipoCosecha": ""
      },
      {
        "lote": "81.02",
        "area": 5.96,
        "tch": 114.5,
        "tons": 115,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "81.03",
        "area": 1.23,
        "tch": 97.8,
        "tons": 120,
        "variedad": "Varias",
        "tipoCosecha": ""
      },
      {
        "lote": "81.04",
        "area": 2.92,
        "tch": 98.8,
        "tons": 289,
        "variedad": "Varias",
        "tipoCosecha": ""
      },
      {
        "lote": "81.05",
        "area": 4.91,
        "tch": 151.01,
        "tons": 242,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "81.06",
        "area": 6.74,
        "tch": 134.82,
        "tons": 13,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "81.07",
        "area": 2.63,
        "tch": 115.94,
        "tons": 305,
        "variedad": "Varias",
        "tipoCosecha": ""
      },
      {
        "lote": "81.08",
        "area": 3.85,
        "tch": 99.81,
        "tons": 384,
        "variedad": "Varias",
        "tipoCosecha": ""
      },
      {
        "lote": "81.09",
        "area": 3.04,
        "tch": 108.12,
        "tons": 108,
        "variedad": "Varias",
        "tipoCosecha": "Corte granel en verde"
      },
      {
        "lote": "81.1",
        "area": 3.44,
        "tch": 102.4,
        "tons": 41,
        "variedad": "Varias",
        "tipoCosecha": "Corte granel en verde"
      },
      {
        "lote": "81.11",
        "area": 6.03,
        "tch": 100.82,
        "tons": 608,
        "variedad": "Varias",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "BUENOS AIRES",
    "code": "20",
    "lotes": [
      {
        "lote": "20.03",
        "area": 145.72,
        "tch": 111.67,
        "tons": 16249,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "20.02",
        "area": 32.27,
        "tch": 76.04,
        "tons": 2446,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "20.01",
        "area": 61.22,
        "tch": 103.29,
        "tons": 6323,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "CARRIZAL",
    "code": "10",
    "lotes": [
      {
        "lote": "10.02",
        "area": 72.65,
        "tch": 122.05,
        "tons": 8867,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "10.03",
        "area": 101.36,
        "tch": 132.41,
        "tons": 13421,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "10.04",
        "area": 103.35,
        "tch": 104.98,
        "tons": 10850,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "10.01",
        "area": 124.12,
        "tch": 113.23,
        "tons": 14054,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "10.05",
        "area": 56.09,
        "tch": 119.17,
        "tons": 6684,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "10.06",
        "area": 42.86,
        "tch": 115.15,
        "tons": 4935,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "10.07",
        "area": 65.1,
        "tch": 110.36,
        "tons": 7019,
        "variedad": "CG12-116",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "10.08",
        "area": 49.77,
        "tch": 125.68,
        "tons": 6239,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "10.09",
        "area": 0,
        "tch": 113.4,
        "tons": 761,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "10.1",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "10.11",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "10.12",
        "area": 6.97,
        "tch": 100,
        "tons": 697,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "10.13",
        "area": 7.76,
        "tch": 100,
        "tons": 776,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "10.14",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "CRISTOBAL 1",
    "code": "9",
    "lotes": [
      {
        "lote": "9.05",
        "area": 50.42,
        "tch": 123.86,
        "tons": 6245,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.11",
        "area": 106.3,
        "tch": 104.96,
        "tons": 10843,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "9.12",
        "area": 128.84,
        "tch": 101.58,
        "tons": 12748,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "9.08",
        "area": 104.54,
        "tch": 127.85,
        "tons": 13366,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.09",
        "area": 63.54,
        "tch": 114.92,
        "tons": 7274,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.07",
        "area": 93.43,
        "tch": 128.93,
        "tons": 12046,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "9.1",
        "area": 86.85,
        "tch": 109.42,
        "tons": 9503,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "9.03",
        "area": 82.87,
        "tch": 80.43,
        "tons": 6665,
        "variedad": "RB845210",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.01",
        "area": 124.5,
        "tch": 85.37,
        "tons": 10620,
        "variedad": "RB845210",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "9.02",
        "area": 60.11,
        "tch": 94.32,
        "tons": 5583,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.04",
        "area": 101.85,
        "tch": 81.49,
        "tons": 8260,
        "variedad": "RB845210",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.06",
        "area": 41.64,
        "tch": 73.95,
        "tons": 3079,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "CRISTOBAL II",
    "code": "16",
    "lotes": [
      {
        "lote": "16.03",
        "area": 11.09,
        "tch": 125.4,
        "tons": 1391,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "16.04",
        "area": 21.34,
        "tch": 117.52,
        "tons": 2508,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "16.05",
        "area": 28.42,
        "tch": 131.69,
        "tons": 3594,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "16.06",
        "area": 64.51,
        "tch": 134.22,
        "tons": 8639,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "16.07",
        "area": 87.68,
        "tch": 118.65,
        "tons": 10395,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "16.01",
        "area": 6.61,
        "tch": 130.73,
        "tons": 864,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "16.02",
        "area": 109.6,
        "tch": 84.42,
        "tons": 9253,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "EL CEDRO CUNTAN",
    "code": "385",
    "lotes": [
      {
        "lote": "1.06",
        "area": 8.63,
        "tch": 123.6,
        "tons": 1067,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.14",
        "area": 15,
        "tch": 131.1,
        "tons": 1967,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.16",
        "area": 13,
        "tch": 123.52,
        "tons": 1606,
        "variedad": "Varias",
        "tipoCosecha": ""
      },
      {
        "lote": "1.18",
        "area": 7.98,
        "tch": 123.04,
        "tons": 982,
        "variedad": "CG04-10267",
        "tipoCosecha": ""
      },
      {
        "lote": "1.19",
        "area": 10.3,
        "tch": 99.64,
        "tons": 1026,
        "variedad": "CG04-10267",
        "tipoCosecha": ""
      },
      {
        "lote": "1.2",
        "area": 11.57,
        "tch": 122.72,
        "tons": 1419,
        "variedad": "Varias",
        "tipoCosecha": ""
      },
      {
        "lote": "1.17",
        "area": 11.17,
        "tch": 125.8,
        "tons": 1405,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.15",
        "area": 14.82,
        "tch": 110.98,
        "tons": 1165,
        "variedad": "CG04-10267",
        "tipoCosecha": ""
      },
      {
        "lote": "1.13",
        "area": 8.63,
        "tch": 123.54,
        "tons": 1066,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.11",
        "area": 16.04,
        "tch": 120.79,
        "tons": 1937,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.1",
        "area": 6.17,
        "tch": 134.12,
        "tons": 617,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.09",
        "area": 14.1,
        "tch": 137,
        "tons": 1932,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.08",
        "area": 7.95,
        "tch": 103.71,
        "tons": 825,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.07",
        "area": 11.5,
        "tch": 168.02,
        "tons": 1932,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.05",
        "area": 9,
        "tch": 199.65,
        "tons": 1797,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.04",
        "area": 9.93,
        "tch": 93,
        "tons": 924,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.03",
        "area": 14.5,
        "tch": 106.74,
        "tons": 1548,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 12.63,
        "tch": 156.59,
        "tons": 1978,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.01",
        "area": 11.19,
        "tch": 102.58,
        "tons": 1148,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "EL HORIZONTE",
    "code": "494",
    "lotes": [
      {
        "lote": "1.01",
        "area": 20.15,
        "tch": 108.91,
        "tons": 2194,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "EL IDEAL DEPROINGUA",
    "code": "636",
    "lotes": [
      {
        "lote": "30.01",
        "area": 14.59,
        "tch": 68.54,
        "tons": 1000,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "30.02",
        "area": 56.49,
        "tch": 65.8,
        "tons": 132,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "30.03",
        "area": 66.88,
        "tch": 76.87,
        "tons": 893,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "30.04",
        "area": 64.51,
        "tch": 84.9,
        "tons": 888,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "EL JUTE",
    "code": "77",
    "lotes": [
      {
        "lote": "77.03",
        "area": 34.97,
        "tch": 132.73,
        "tons": 4642,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.04",
        "area": 11.84,
        "tch": 113.35,
        "tons": 1342,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.05",
        "area": 29.19,
        "tch": 120.19,
        "tons": 3508,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.06",
        "area": 54.52,
        "tch": 110.92,
        "tons": 6047,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.02",
        "area": 19.45,
        "tch": 90.14,
        "tons": 1753,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.01",
        "area": 24.65,
        "tch": 102.38,
        "tons": 2524,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "77.07",
        "area": 20.7,
        "tch": 150.01,
        "tons": 3105,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "77.09",
        "area": 18.6,
        "tch": 131.52,
        "tons": 2446,
        "variedad": "CG12-116",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.16",
        "area": 36.28,
        "tch": 131.69,
        "tons": 4778,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.17",
        "area": 35.91,
        "tch": 129.81,
        "tons": 4662,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "77.18",
        "area": 16.75,
        "tch": 111.07,
        "tons": 1860,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.1",
        "area": 9.01,
        "tch": 138.32,
        "tons": 1246,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.11",
        "area": 28.29,
        "tch": 115.22,
        "tons": 3260,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.12",
        "area": 3.66,
        "tch": 106.43,
        "tons": 390,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.13",
        "area": 4.86,
        "tch": 104.72,
        "tons": 509,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.14",
        "area": 14.62,
        "tch": 88.95,
        "tons": 1301,
        "variedad": "CG12-116",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.15",
        "area": 7.06,
        "tch": 84.66,
        "tons": 598,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "77.19",
        "area": 14.25,
        "tch": 106.37,
        "tons": 1516,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.21",
        "area": 19.58,
        "tch": 113.23,
        "tons": 2217,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "77.22",
        "area": 18.82,
        "tch": 96.15,
        "tons": 1810,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.23",
        "area": 17.57,
        "tch": 134.93,
        "tons": 2371,
        "variedad": "RB845210",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "77.24",
        "area": 59.62,
        "tch": 109.89,
        "tons": 6552,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "77.08",
        "area": 20.45,
        "tch": 119.62,
        "tons": 2446,
        "variedad": "Varias",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "EL NACIMIENTO",
    "code": "56",
    "lotes": [
      {
        "lote": "56.01",
        "area": 31.15,
        "tch": 120.84,
        "tons": 3764,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "56.03",
        "area": 69.05,
        "tch": 87.74,
        "tons": 6058,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "56.02",
        "area": 55.16,
        "tch": 79.21,
        "tons": 4369,
        "variedad": "RB845210",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "EL PERÚ",
    "code": "557",
    "lotes": [
      {
        "lote": "1.01",
        "area": 12.57,
        "tch": 74.35,
        "tons": 935,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "EL PLACER",
    "code": "348",
    "lotes": [
      {
        "lote": "3.01",
        "area": 10.37,
        "tch": 59.97,
        "tons": 622,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.01",
        "area": 6.73,
        "tch": 32.59,
        "tons": 219,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.02",
        "area": 5.21,
        "tch": 178.58,
        "tons": 930,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.01",
        "area": 0.82,
        "tch": 33.18,
        "tons": 27,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.02",
        "area": 1.25,
        "tch": 107.73,
        "tons": 135,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "6.03",
        "area": 3.85,
        "tch": 66.45,
        "tons": 256,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.03",
        "area": 2.86,
        "tch": 43.26,
        "tons": 124,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.04",
        "area": 4.06,
        "tch": 38.87,
        "tons": 158,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 2.13,
        "tch": 64.4,
        "tons": 137,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.04",
        "area": 7.82,
        "tch": 62.11,
        "tons": 486,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.01",
        "area": 3.61,
        "tch": 155.93,
        "tons": 390,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.02",
        "area": 6.46,
        "tch": 67.26,
        "tons": 435,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.01",
        "area": 3.86,
        "tch": 41.68,
        "tons": 161,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "5.02",
        "area": 5.59,
        "tch": 60.89,
        "tons": 340,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.01",
        "area": 2.09,
        "tch": 65.83,
        "tons": 138,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.03",
        "area": 2.42,
        "tch": 73.49,
        "tons": 178,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.05",
        "area": 2.65,
        "tch": 62.49,
        "tons": 166,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.06",
        "area": 5.15,
        "tch": 57.12,
        "tons": 294,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "EL RECUERDO MAPAN",
    "code": "70",
    "lotes": [
      {
        "lote": "70.01",
        "area": 35.31,
        "tch": 96.28,
        "tons": 3399,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "EL SOMBRERO",
    "code": "334",
    "lotes": [
      {
        "lote": "1.01",
        "area": 19.51,
        "tch": 86.56,
        "tons": 1689,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "EL TIGRE",
    "code": "13",
    "lotes": [
      {
        "lote": "13.01",
        "area": 44.37,
        "tch": 88.2,
        "tons": 3914,
        "variedad": "Varias",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      }
    ]
  },
  {
    "name": "EL TIGRE PUERTAS",
    "code": "69",
    "lotes": [
      {
        "lote": "69.01",
        "area": 93.11,
        "tch": 103.59,
        "tons": 9645,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "FERTICAÑA",
    "code": "548",
    "lotes": [
      {
        "lote": "1.01",
        "area": 22.4,
        "tch": 84.7,
        "tons": 1897,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.04",
        "area": 3.22,
        "tch": 130.46,
        "tons": 420,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.26",
        "area": 3.34,
        "tch": 139.56,
        "tons": 466,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.45",
        "area": 14.09,
        "tch": 103.48,
        "tons": 1458,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 19.3,
        "tch": 97.57,
        "tons": 1883,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.23",
        "area": 9.11,
        "tch": 99.2,
        "tons": 904,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.09",
        "area": 12.34,
        "tch": 95.35,
        "tons": 1177,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.25",
        "area": 6,
        "tch": 165.02,
        "tons": 660,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.05",
        "area": 10.88,
        "tch": 128.23,
        "tons": 1395,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.04",
        "area": 7,
        "tch": 81.38,
        "tons": 570,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.2",
        "area": 3.33,
        "tch": 89.84,
        "tons": 299,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.71",
        "area": 17.48,
        "tch": 100.11,
        "tons": 1750,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.31",
        "area": 11.2,
        "tch": 103.61,
        "tons": 1160,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.04",
        "area": 35.19,
        "tch": 120.12,
        "tons": 4227,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.02",
        "area": 10.48,
        "tch": 121.54,
        "tons": 1274,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.03",
        "area": 5.79,
        "tch": 139.58,
        "tons": 808,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.01",
        "area": 4.73,
        "tch": 115.52,
        "tons": 546,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.22",
        "area": 9.6,
        "tch": 35.96,
        "tons": 345,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.16",
        "area": 3,
        "tch": 96.44,
        "tons": 289,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.09",
        "area": 1.79,
        "tch": 64.45,
        "tons": 115,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.06",
        "area": 2.42,
        "tch": 124.73,
        "tons": 302,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.25",
        "area": 1.93,
        "tch": 84,
        "tons": 162,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.21",
        "area": 14.49,
        "tch": 44.31,
        "tons": 642,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.41",
        "area": 5.88,
        "tch": 116.68,
        "tons": 686,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.1",
        "area": 5.79,
        "tch": 110.67,
        "tons": 641,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.69",
        "area": 10.59,
        "tch": 70.13,
        "tons": 743,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.61",
        "area": 10.95,
        "tch": 123.06,
        "tons": 1348,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.5",
        "area": 15,
        "tch": 113.38,
        "tons": 1701,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.67",
        "area": 2.69,
        "tch": 107.47,
        "tons": 107,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.06",
        "area": 2.02,
        "tch": 69.38,
        "tons": 140,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.21",
        "area": 7.12,
        "tch": 103.58,
        "tons": 737,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.33",
        "area": 2.6,
        "tch": 66.53,
        "tons": 173,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.54",
        "area": 1.39,
        "tch": 163.02,
        "tons": 227,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.19",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.72",
        "area": 12.51,
        "tch": 90.09,
        "tons": 1127,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.11",
        "area": 4.89,
        "tch": 61.01,
        "tons": 298,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.12",
        "area": 23.73,
        "tch": 69.71,
        "tons": 1654,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.28",
        "area": 11.66,
        "tch": 75.9,
        "tons": 885,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.29",
        "area": 14.1,
        "tch": 86.41,
        "tons": 1218,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.07",
        "area": 2,
        "tch": 58,
        "tons": 116,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.14",
        "area": 2.27,
        "tch": 62.08,
        "tons": 31,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.11",
        "area": 1.78,
        "tch": 52.06,
        "tons": 93,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.12",
        "area": 8.5,
        "tch": 113.06,
        "tons": 961,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.22",
        "area": 3.14,
        "tch": 61.4,
        "tons": 193,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.21",
        "area": 5.65,
        "tch": 90.84,
        "tons": 513,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.2",
        "area": 6.25,
        "tch": 82.74,
        "tons": 517,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.02",
        "area": 1.53,
        "tch": 57.29,
        "tons": 88,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.13",
        "area": 8.74,
        "tch": 44.89,
        "tons": 392,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.23",
        "area": 2.1,
        "tch": 112.98,
        "tons": 237,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.17",
        "area": 4.19,
        "tch": 83.53,
        "tons": 350,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "3.03",
        "area": 1.4,
        "tch": 89.72,
        "tons": 126,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.32",
        "area": 4,
        "tch": 133.1,
        "tons": 532,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.03",
        "area": 6,
        "tch": 92.87,
        "tons": 557,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.81",
        "area": 2.09,
        "tch": 29.23,
        "tons": 61,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.01",
        "area": 3.7,
        "tch": 92.9,
        "tons": 344,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.18",
        "area": 6,
        "tch": 69.05,
        "tons": 414,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.07",
        "area": 6.35,
        "tch": 103.1,
        "tons": 655,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.17",
        "area": 4,
        "tch": 60.36,
        "tons": 241,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.1",
        "area": 4.31,
        "tch": 142.11,
        "tons": 612,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.26",
        "area": 5.24,
        "tch": 47.25,
        "tons": 248,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.15",
        "area": 1.63,
        "tch": 67.6,
        "tons": 110,
        "variedad": "CG98-46",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "FLORENCIA..",
    "code": "225",
    "lotes": [
      {
        "lote": "1.21",
        "area": 8.12,
        "tch": 73.05,
        "tons": 593,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.22",
        "area": 7.98,
        "tch": 75.91,
        "tons": 606,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.16",
        "area": 7.34,
        "tch": 93.41,
        "tons": 686,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.18",
        "area": 5.94,
        "tch": 115.71,
        "tons": 687,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.19",
        "area": 6.18,
        "tch": 100.01,
        "tons": 618,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.2",
        "area": 7.41,
        "tch": 81.83,
        "tons": 606,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.13",
        "area": 6.87,
        "tch": 90.53,
        "tons": 622,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.14",
        "area": 6.51,
        "tch": 103.7,
        "tons": 675,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.15",
        "area": 7.09,
        "tch": 74.61,
        "tons": 529,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.17",
        "area": 7.06,
        "tch": 73.36,
        "tons": 518,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.12",
        "area": 6.55,
        "tch": 79.71,
        "tons": 80,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.11",
        "area": 7,
        "tch": 84.52,
        "tons": 592,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.1",
        "area": 6.25,
        "tch": 76.76,
        "tons": 480,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.09",
        "area": 6.64,
        "tch": 100,
        "tons": 664,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.08",
        "area": 5.04,
        "tch": 90.36,
        "tons": 455,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.07",
        "area": 6.55,
        "tch": 90.02,
        "tons": 590,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.06",
        "area": 4.83,
        "tch": 88.61,
        "tons": 428,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.05",
        "area": 9.68,
        "tch": 75.86,
        "tons": 734,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.04",
        "area": 8.72,
        "tch": 76.3,
        "tons": 665,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.01",
        "area": 13.38,
        "tch": 78.55,
        "tons": 1051,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 7.79,
        "tch": 85.93,
        "tons": 669,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.03",
        "area": 0.75,
        "tch": 63.54,
        "tons": 48,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "IRLANDA",
    "code": "64",
    "lotes": [
      {
        "lote": "64.04",
        "area": 99.16,
        "tch": 106.52,
        "tons": 10563,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "64.03",
        "area": 101.54,
        "tch": 117.45,
        "tons": 11854,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "64.01",
        "area": 109.39,
        "tch": 121.99,
        "tons": 13344,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "64.02",
        "area": 83.69,
        "tch": 142.36,
        "tons": 11914,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "64.05",
        "area": 9.25,
        "tch": 73.51,
        "tons": 680,
        "variedad": "Varias",
        "tipoCosecha": ""
      },
      {
        "lote": "64.06",
        "area": 11.75,
        "tch": 76.6,
        "tons": 900,
        "variedad": "Varias",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "IRLANDA GOMEZ",
    "code": "516",
    "lotes": [
      {
        "lote": "1.01",
        "area": 2.07,
        "tch": 121.58,
        "tons": 252,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 2.46,
        "tch": 154.97,
        "tons": 381,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.03",
        "area": 2.47,
        "tch": 142.67,
        "tons": 352,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.04",
        "area": 3.49,
        "tch": 144.9,
        "tons": 506,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.05",
        "area": 3.35,
        "tch": 148.63,
        "tons": 498,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.06",
        "area": 3.45,
        "tch": 174.91,
        "tons": 603,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.0101",
        "area": 4.86,
        "tch": 172.21,
        "tons": 837,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.07",
        "area": 8.1,
        "tch": 160.22,
        "tons": 1298,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.13",
        "area": 7.33,
        "tch": 139.86,
        "tons": 1025,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.19",
        "area": 7.67,
        "tch": 182.74,
        "tons": 1402,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.25",
        "area": 8.05,
        "tch": 138.4,
        "tons": 1114,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.01",
        "area": 13.03,
        "tch": 165.99,
        "tons": 2163,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.13",
        "area": 11.28,
        "tch": 145.19,
        "tons": 1638,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.19",
        "area": 15.62,
        "tch": 152.4,
        "tons": 2381,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.01",
        "area": 8.36,
        "tch": 165.09,
        "tons": 1380,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.07",
        "area": 8.94,
        "tch": 170.43,
        "tons": 1524,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.13",
        "area": 10.85,
        "tch": 128.73,
        "tons": 1397,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.19",
        "area": 5.43,
        "tch": 177.69,
        "tons": 965,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.25",
        "area": 7.31,
        "tch": 120.49,
        "tons": 881,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.01",
        "area": 10.29,
        "tch": 122.1,
        "tons": 1256,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.05",
        "area": 8.64,
        "tch": 164.4,
        "tons": 1420,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.09",
        "area": 12.74,
        "tch": 109.72,
        "tons": 1398,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.1",
        "area": 26.55,
        "tch": 170.72,
        "tons": 4533,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.06",
        "area": 17.89,
        "tch": 120.77,
        "tons": 2161,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.02",
        "area": 20.33,
        "tch": 149.35,
        "tons": 3036,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.26",
        "area": 7.35,
        "tch": 136.62,
        "tons": 1004,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.27",
        "area": 6.71,
        "tch": 140.27,
        "tons": 941,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.2",
        "area": 7.31,
        "tch": 153.07,
        "tons": 1119,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.21",
        "area": 7.27,
        "tch": 134.55,
        "tons": 978,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.14",
        "area": 7.55,
        "tch": 129.28,
        "tons": 976,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.15",
        "area": 6.99,
        "tch": 121.83,
        "tons": 852,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.08",
        "area": 7.58,
        "tch": 116.44,
        "tons": 883,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.09",
        "area": 6.9,
        "tch": 133.79,
        "tons": 923,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.02",
        "area": 7.71,
        "tch": 164.68,
        "tons": 1270,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.03",
        "area": 7.2,
        "tch": 157.72,
        "tons": 1136,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.2",
        "area": 13.82,
        "tch": 150.17,
        "tons": 2075,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.21",
        "area": 13.79,
        "tch": 146.09,
        "tons": 2015,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.15",
        "area": 11.03,
        "tch": 140.43,
        "tons": 1549,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.14",
        "area": 10.98,
        "tch": 144.71,
        "tons": 1589,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "2.02",
        "area": 12.67,
        "tch": 139.52,
        "tons": 1768,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.03",
        "area": 13.64,
        "tch": 125.14,
        "tons": 1707,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "1.26",
        "area": 7.81,
        "tch": 154.15,
        "tons": 1204,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.27",
        "area": 8.32,
        "tch": 130.66,
        "tons": 1087,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.2",
        "area": 7.57,
        "tch": 142,
        "tons": 1075,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.21",
        "area": 8.09,
        "tch": 137.63,
        "tons": 1113,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.14",
        "area": 7.5,
        "tch": 185.4,
        "tons": 1391,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.15",
        "area": 8.1,
        "tch": 124.97,
        "tons": 1012,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.08",
        "area": 7.19,
        "tch": 154.52,
        "tons": 1111,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.09",
        "area": 8.11,
        "tch": 160.46,
        "tons": 1301,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.0201",
        "area": 4.02,
        "tch": 143.85,
        "tons": 578,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.0301",
        "area": 3.72,
        "tch": 145.82,
        "tons": 542,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.0401",
        "area": 2.89,
        "tch": 148.36,
        "tons": 429,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.0501",
        "area": 3.19,
        "tch": 143.41,
        "tons": 457,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.0601",
        "area": 3.49,
        "tch": 162.28,
        "tons": 566,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.1",
        "area": 8.27,
        "tch": 149.99,
        "tons": 1240,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.11",
        "area": 7.65,
        "tch": 130.12,
        "tons": 995,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "1.12",
        "area": 7.01,
        "tch": 128.29,
        "tons": 899,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.16",
        "area": 8.45,
        "tch": 149.32,
        "tons": 1262,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.17",
        "area": 7.15,
        "tch": 147.52,
        "tons": 1055,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.18",
        "area": 7.32,
        "tch": 150.79,
        "tons": 1104,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.22",
        "area": 8.11,
        "tch": 132.4,
        "tons": 1074,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.24",
        "area": 7.02,
        "tch": 208.18,
        "tons": 1461,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.28",
        "area": 8.35,
        "tch": 116.45,
        "tons": 972,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.29",
        "area": 7.5,
        "tch": 124.84,
        "tons": 936,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "1.3",
        "area": 7.65,
        "tch": 144.91,
        "tons": 1109,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.04",
        "area": 12.09,
        "tch": 140.93,
        "tons": 1704,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.05",
        "area": 10.84,
        "tch": 178.04,
        "tons": 1930,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.06",
        "area": 12.53,
        "tch": 151.73,
        "tons": 1901,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.16",
        "area": 11.68,
        "tch": 106.69,
        "tons": 1246,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.17",
        "area": 11.93,
        "tch": 136.88,
        "tons": 1633,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.18",
        "area": 8.49,
        "tch": 145.65,
        "tons": 1237,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.22",
        "area": 13.99,
        "tch": 132.09,
        "tons": 1848,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.23",
        "area": 15.15,
        "tch": 109.22,
        "tons": 1655,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.24",
        "area": 12.49,
        "tch": 137.66,
        "tons": 1719,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "4.03",
        "area": 20.88,
        "tch": 123.56,
        "tons": 2580,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "4.04",
        "area": 10.55,
        "tch": 134.95,
        "tons": 1424,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "4.07",
        "area": 20.88,
        "tch": 137.54,
        "tons": 2872,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "4.08",
        "area": 10.98,
        "tch": 135.94,
        "tons": 1493,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.04",
        "area": 7.05,
        "tch": 142.91,
        "tons": 1008,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.05",
        "area": 7.27,
        "tch": 135.35,
        "tons": 984,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.06",
        "area": 5.88,
        "tch": 179.94,
        "tons": 1058,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.1",
        "area": 8.2,
        "tch": 121.81,
        "tons": 999,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.11",
        "area": 7.29,
        "tch": 141.69,
        "tons": 1033,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.12",
        "area": 7.32,
        "tch": 144.37,
        "tons": 1057,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.16",
        "area": 7.71,
        "tch": 156.82,
        "tons": 1209,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.17",
        "area": 7.52,
        "tch": 133.23,
        "tons": 1002,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.18",
        "area": 7.83,
        "tch": 135.66,
        "tons": 1062,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.22",
        "area": 8.2,
        "tch": 146.46,
        "tons": 1201,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.23",
        "area": 7.55,
        "tch": 133.66,
        "tons": 1009,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.24",
        "area": 7.35,
        "tch": 157.87,
        "tons": 1160,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.28",
        "area": 6.74,
        "tch": 155.52,
        "tons": 1048,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.29",
        "area": 7.15,
        "tch": 138.05,
        "tons": 987,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.3",
        "area": 7.06,
        "tch": 176.87,
        "tons": 1249,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.11",
        "area": 22.6,
        "tch": 149.9,
        "tons": 3388,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.12",
        "area": 12.54,
        "tch": 167.13,
        "tons": 2096,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.13",
        "area": 8.8,
        "tch": 130.99,
        "tons": 1153,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.14",
        "area": 5.15,
        "tch": 153.99,
        "tons": 793,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      }
    ]
  },
  {
    "name": "JABALI III",
    "code": "67",
    "lotes": [
      {
        "lote": "67.05",
        "area": 53.1,
        "tch": 80.14,
        "tons": 4247,
        "variedad": "RB845210",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "67.03",
        "area": 18.35,
        "tch": 88.44,
        "tons": 1623,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "67.04",
        "area": 99.24,
        "tch": 93.95,
        "tons": 9324,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "67.02",
        "area": 67.77,
        "tch": 92.81,
        "tons": 6290,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "JABALI INAFEB",
    "code": "625",
    "lotes": [
      {
        "lote": "1.01",
        "area": 55.8,
        "tch": 128.47,
        "tons": 7169,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "JABALI LU",
    "code": "75",
    "lotes": [
      {
        "lote": "75.01",
        "area": 29.52,
        "tch": 127.98,
        "tons": 3720,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "75.03",
        "area": 51.41,
        "tch": 130.01,
        "tons": 6684,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "75.06",
        "area": 31.88,
        "tch": 135.05,
        "tons": 4305,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "75.07",
        "area": 7.85,
        "tch": 102.98,
        "tons": 780,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "75.02",
        "area": 42.5,
        "tch": 108.25,
        "tons": 4522,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "75.04",
        "area": 28.42,
        "tch": 90.81,
        "tons": 2549,
        "variedad": "CG10-0974",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "75.05",
        "area": 61.98,
        "tch": 102.81,
        "tons": 5645,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "LA  CONFIANZA",
    "code": "36",
    "lotes": [
      {
        "lote": "36.07",
        "area": 74.77,
        "tch": 102.18,
        "tons": 7640,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "36.06",
        "area": 74.87,
        "tch": 128.69,
        "tons": 9635,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "36.03",
        "area": 51.87,
        "tch": 111.28,
        "tons": 5763,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "36.08",
        "area": 100.24,
        "tch": 124.42,
        "tons": 12322,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "36.01",
        "area": 24.31,
        "tch": 40.09,
        "tons": 917,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "36.02",
        "area": 47.97,
        "tch": 97.4,
        "tons": 4672,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "36.04",
        "area": 41.04,
        "tch": 97.9,
        "tons": 4018,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "36.05",
        "area": 91.63,
        "tch": 130.99,
        "tons": 11973,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "LA  COQUETA",
    "code": "19",
    "lotes": [
      {
        "lote": "19.01",
        "area": 28.01,
        "tch": 102.06,
        "tons": 2859,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "19.02",
        "area": 112.84,
        "tch": 135.78,
        "tons": 11355,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "LA ALEGRIA",
    "code": "57",
    "lotes": [
      {
        "lote": "57.02",
        "area": 22.64,
        "tch": 42.32,
        "tons": 837,
        "variedad": "CG98-78",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "LA BENDICÓN 1",
    "code": "604",
    "lotes": [
      {
        "lote": "6.01",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "9.01",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "7.01",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.01",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.01",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "LA CONFIANZA",
    "code": "36",
    "lotes": [
      {
        "lote": "36.09",
        "area": 9.01,
        "tch": 88.79,
        "tons": 800,
        "variedad": "Varias",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "LA COQUETA",
    "code": "19",
    "lotes": [
      {
        "lote": "19.02",
        "area": 112.84,
        "tch": 58.03,
        "tons": 157,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "LA ESPERANZA",
    "code": "53",
    "lotes": [
      {
        "lote": "53.01",
        "area": 41.26,
        "tch": 122.09,
        "tons": 5000,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "53.02",
        "area": 107.58,
        "tch": 88.48,
        "tons": 9404,
        "variedad": "RB845210",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "53.03",
        "area": 42.96,
        "tch": 85,
        "tons": 3651,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "53.04",
        "area": 26.11,
        "tch": 80.34,
        "tons": 2098,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "53.05",
        "area": 15.34,
        "tch": 77.1,
        "tons": 1170,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "LA FLORA INAFEB",
    "code": "533",
    "lotes": [
      {
        "lote": "1.04",
        "area": 45.59,
        "tch": 103,
        "tons": 4696,
        "variedad": "CP72-2086",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "LA MONTAÑESA",
    "code": "590",
    "lotes": [
      {
        "lote": "2.02",
        "area": 12.16,
        "tch": 156.23,
        "tons": 1900,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.03",
        "area": 19.18,
        "tch": 153.93,
        "tons": 2952,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.07",
        "area": 7.86,
        "tch": 195.06,
        "tons": 1533,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.09",
        "area": 10.77,
        "tch": 124.01,
        "tons": 1336,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.1",
        "area": 3.26,
        "tch": 177.97,
        "tons": 580,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.16",
        "area": 11.02,
        "tch": 150.4,
        "tons": 1657,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.17",
        "area": 3.77,
        "tch": 171.82,
        "tons": 648,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.01",
        "area": 5.78,
        "tch": 147.21,
        "tons": 851,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.02",
        "area": 11.29,
        "tch": 136.41,
        "tons": 1540,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.03",
        "area": 4,
        "tch": 152.96,
        "tons": 612,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.09",
        "area": 5.78,
        "tch": 145.92,
        "tons": 843,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.1",
        "area": 10.91,
        "tch": 161.2,
        "tons": 1759,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.11",
        "area": 3.95,
        "tch": 136.87,
        "tons": 541,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.12",
        "area": 5.78,
        "tch": 145.42,
        "tons": 841,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.13",
        "area": 11.24,
        "tch": 168,
        "tons": 1888,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.14",
        "area": 4.01,
        "tch": 96.19,
        "tons": 386,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.18",
        "area": 6.04,
        "tch": 123.88,
        "tons": 748,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.19",
        "area": 11.21,
        "tch": 149.16,
        "tons": 1672,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.2",
        "area": 4.19,
        "tch": 141.57,
        "tons": 593,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.26",
        "area": 5.81,
        "tch": 157.14,
        "tons": 913,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.27",
        "area": 11.08,
        "tch": 151.54,
        "tons": 1679,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.28",
        "area": 3.87,
        "tch": 145.45,
        "tons": 563,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "4.01",
        "area": 15.03,
        "tch": 135.85,
        "tons": 2042,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.02",
        "area": 29.21,
        "tch": 152.55,
        "tons": 4456,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.03",
        "area": 10.94,
        "tch": 164.86,
        "tons": 1804,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.11",
        "area": 7.24,
        "tch": 137.97,
        "tons": 999,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.05",
        "area": 4.31,
        "tch": 155.95,
        "tons": 672,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.06",
        "area": 12.07,
        "tch": 131.26,
        "tons": 1584,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.12",
        "area": 5.02,
        "tch": 161.52,
        "tons": 811,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.13",
        "area": 7.6,
        "tch": 130.86,
        "tons": 995,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.14",
        "area": 20.34,
        "tch": 156.63,
        "tons": 3186,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "2.18",
        "area": 7.27,
        "tch": 205.8,
        "tons": 1496,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.19",
        "area": 8.64,
        "tch": 136.91,
        "tons": 1183,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.04",
        "area": 5.81,
        "tch": 140.45,
        "tons": 816,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.05",
        "area": 10.47,
        "tch": 127.26,
        "tons": 1332,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.06",
        "area": 8.2,
        "tch": 145.37,
        "tons": 1192,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.07",
        "area": 11.42,
        "tch": 144.18,
        "tons": 1647,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.08",
        "area": 10.96,
        "tch": 128.39,
        "tons": 1407,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.15",
        "area": 6.73,
        "tch": 123.87,
        "tons": 834,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.16",
        "area": 7.82,
        "tch": 127.37,
        "tons": 996,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.17",
        "area": 16.13,
        "tch": 124.97,
        "tons": 2016,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.21",
        "area": 6.55,
        "tch": 128,
        "tons": 838,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.22",
        "area": 13.1,
        "tch": 146.75,
        "tons": 1922,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.29",
        "area": 6.27,
        "tch": 143.95,
        "tons": 903,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.23",
        "area": 19.16,
        "tch": 123.22,
        "tons": 2361,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.24",
        "area": 4.45,
        "tch": 178.46,
        "tons": 794,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.04",
        "area": 25.36,
        "tch": 138.17,
        "tons": 3504,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "4.05",
        "area": 23.72,
        "tch": 125.37,
        "tons": 2974,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "4.06",
        "area": 21.15,
        "tch": 134.88,
        "tons": 2853,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "6.02",
        "area": 6.9,
        "tch": 101.05,
        "tons": 697,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "6.01",
        "area": 6.63,
        "tch": 106.95,
        "tons": 709,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "LA PERLA LU",
    "code": "18",
    "lotes": [
      {
        "lote": "18.01",
        "area": 66.94,
        "tch": 118.7,
        "tons": 7944,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "LA SIERRA",
    "code": "73",
    "lotes": [
      {
        "lote": "73.04",
        "area": 38.02,
        "tch": 168.36,
        "tons": 6401,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "73.05",
        "area": 125.44,
        "tch": 140.91,
        "tons": 17675,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "73.06",
        "area": 60.98,
        "tch": 137.16,
        "tons": 8364,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "73.02",
        "area": 60.5,
        "tch": 135.4,
        "tons": 8192,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "73.07",
        "area": 42.47,
        "tch": 124.1,
        "tons": 5270,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "73.01",
        "area": 121.32,
        "tch": 138.95,
        "tons": 16857,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "73.09",
        "area": 120.87,
        "tch": 147.49,
        "tons": 17703,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "73.03",
        "area": 115.8,
        "tch": 145.03,
        "tons": 16794,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "73.08",
        "area": 47.81,
        "tch": 140.77,
        "tons": 6730,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "LA UNION CAJON",
    "code": "39",
    "lotes": [
      {
        "lote": "39.12",
        "area": 33.01,
        "tch": 111,
        "tons": 3664,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "39.01",
        "area": 13.41,
        "tch": 100.49,
        "tons": 1348,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "39.02",
        "area": 16.01,
        "tch": 83.94,
        "tons": 1344,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "39.05",
        "area": 18.64,
        "tch": 107.55,
        "tons": 1940,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "39.06",
        "area": 17.15,
        "tch": 68.61,
        "tons": 1177,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "39.07",
        "area": 16.39,
        "tch": 85.56,
        "tons": 1395,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "39.08",
        "area": 6.09,
        "tch": 109.9,
        "tons": 636,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "39.09",
        "area": 24.97,
        "tch": 91.87,
        "tons": 2230,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "39.1",
        "area": 30.02,
        "tch": 90,
        "tons": 2609,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "39.11",
        "area": 11.41,
        "tch": 71.82,
        "tons": 819,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "LAS ARENAS INAFEB",
    "code": "534",
    "lotes": [
      {
        "lote": "9.01",
        "area": 15.92,
        "tch": 55,
        "tons": 876,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "8.01",
        "area": 21.22,
        "tch": 75,
        "tons": 1592,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "7.01",
        "area": 32.04,
        "tch": 120,
        "tons": 3845,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "3.01",
        "area": 72.22,
        "tch": 120,
        "tons": 8666,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "4.01",
        "area": 41.65,
        "tch": 110,
        "tons": 4582,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "6.01",
        "area": 19.1,
        "tch": 103,
        "tons": 1967,
        "variedad": "CG10-044124",
        "tipoCosecha": ""
      },
      {
        "lote": "1.01",
        "area": 14.19,
        "tch": 70,
        "tons": 993,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": ""
      },
      {
        "lote": "2.01",
        "area": 14.8,
        "tch": 90,
        "tons": 1332,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": ""
      },
      {
        "lote": "5.01",
        "area": 18.93,
        "tch": 65,
        "tons": 1230,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "LAS CHUSPAS",
    "code": "76",
    "lotes": [
      {
        "lote": "76.01",
        "area": 72.42,
        "tch": 133.16,
        "tons": 9643,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "76.04",
        "area": 71.23,
        "tch": 118.92,
        "tons": 8471,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "76.02",
        "area": 86.12,
        "tch": 141.97,
        "tons": 12226,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "76.03",
        "area": 66.77,
        "tch": 141.92,
        "tons": 9476,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "76.05",
        "area": 81.64,
        "tch": 163.66,
        "tons": 13361,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      }
    ]
  },
  {
    "name": "LAS FLORES PORTILLO",
    "code": "579",
    "lotes": [
      {
        "lote": "1.07",
        "area": 14.77,
        "tch": 73.25,
        "tons": 1082,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.01",
        "area": 12.36,
        "tch": 50.28,
        "tons": 621,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.03",
        "area": 14.62,
        "tch": 73.65,
        "tons": 1077,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 7.72,
        "tch": 65.57,
        "tons": 506,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.04",
        "area": 12.29,
        "tch": 74.56,
        "tons": 916,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.05",
        "area": 9.66,
        "tch": 77.49,
        "tons": 749,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.06",
        "area": 4.44,
        "tch": 48.65,
        "tons": 216,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.08",
        "area": 4.46,
        "tch": 129.16,
        "tons": 576,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.09",
        "area": 7.72,
        "tch": 49.39,
        "tons": 381,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "LAS ILUSIONES",
    "code": "575",
    "lotes": [
      {
        "lote": "5.01",
        "area": 8.67,
        "tch": 122.86,
        "tons": 1065,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.01",
        "area": 23.44,
        "tch": 111.82,
        "tons": 2621,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.02",
        "area": 9.61,
        "tch": 122.86,
        "tons": 1181,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "2.01",
        "area": 9.68,
        "tch": 146.78,
        "tons": 1421,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "3.01",
        "area": 9.94,
        "tch": 146.78,
        "tons": 1459,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "4.01",
        "area": 16.33,
        "tch": 115.5,
        "tons": 1886,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "6.01",
        "area": 12.27,
        "tch": 113.66,
        "tons": 1395,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "6.02",
        "area": 16.72,
        "tch": 128.38,
        "tons": 2147,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "6.03",
        "area": 3.09,
        "tch": 110.9,
        "tons": 343,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "7.01",
        "area": 9.56,
        "tch": 132.98,
        "tons": 1271,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "7.02",
        "area": 22.64,
        "tch": 42.32,
        "tons": 837,
        "variedad": "CG98-78",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "7.03",
        "area": 5.35,
        "tch": 130,
        "tons": 696,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "9.01",
        "area": 9.22,
        "tch": 103.82,
        "tons": 957,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "9.02",
        "area": 9.43,
        "tch": 120,
        "tons": 1132,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "10.01",
        "area": 19.79,
        "tch": 120,
        "tons": 2375,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "11.01",
        "area": 8.86,
        "tch": 105.38,
        "tons": 934,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "12.01",
        "area": 13.24,
        "tch": 110,
        "tons": 1456,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "13.01",
        "area": 10.98,
        "tch": 100,
        "tons": 1098,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "13.02",
        "area": 9.06,
        "tch": 83.66,
        "tons": 758,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "14.01",
        "area": 19.75,
        "tch": 90.66,
        "tons": 1791,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "15.01",
        "area": 11.1,
        "tch": 104.46,
        "tons": 1160,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "15.02",
        "area": 11.8,
        "tch": 97.1,
        "tons": 1146,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.01",
        "area": 6.81,
        "tch": 98.02,
        "tons": 668,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "16.02",
        "area": 6.29,
        "tch": 98.02,
        "tons": 617,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "17.01",
        "area": 4.98,
        "tch": 106.3,
        "tons": 529,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "17.02",
        "area": 4.64,
        "tch": 114.58,
        "tons": 532,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "18.01",
        "area": 9.33,
        "tch": 97.19,
        "tons": 907,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "18.02",
        "area": 10.05,
        "tch": 94.87,
        "tons": 953,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "19.01",
        "area": 14.09,
        "tch": 86.98,
        "tons": 1226,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "19.02",
        "area": 10.13,
        "tch": 91.58,
        "tons": 928,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "20.01",
        "area": 13.38,
        "tch": 100.78,
        "tons": 1348,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "20.02",
        "area": 13,
        "tch": 100.78,
        "tons": 1310,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "21.01",
        "area": 7.07,
        "tch": 90.66,
        "tons": 641,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "21.02",
        "area": 9.97,
        "tch": 90.66,
        "tons": 904,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "22.01",
        "area": 10.56,
        "tch": 97.1,
        "tons": 1025,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "22.02",
        "area": 11.02,
        "tch": 104.26,
        "tons": 1149,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "8.01",
        "area": 4.46,
        "tch": 107.47,
        "tons": 479,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "23.01",
        "area": 10.82,
        "tch": 97.03,
        "tons": 1050,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "23.02",
        "area": 11.63,
        "tch": 98.54,
        "tons": 1146,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "24.01",
        "area": 12.75,
        "tch": 100.78,
        "tons": 1285,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "24.02",
        "area": 6.87,
        "tch": 100.78,
        "tons": 692,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "25.01",
        "area": 13.25,
        "tch": 101.02,
        "tons": 1339,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "25.02",
        "area": 12.21,
        "tch": 93.64,
        "tons": 1143,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "26.01",
        "area": 10.52,
        "tch": 95.26,
        "tons": 1002,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "26.02",
        "area": 9.94,
        "tch": 91.58,
        "tons": 910,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "27.01",
        "area": 10.45,
        "tch": 100.63,
        "tons": 1052,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "27.02",
        "area": 10.66,
        "tch": 98.55,
        "tons": 1051,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "28.01",
        "area": 1.5,
        "tch": 100.78,
        "tons": 151,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "29.01",
        "area": 10.88,
        "tch": 94.34,
        "tons": 1026,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "30.01",
        "area": 6.22,
        "tch": 100.78,
        "tons": 627,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "30.02",
        "area": 3.47,
        "tch": 104.46,
        "tons": 362,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "31.01",
        "area": 13.8,
        "tch": 100.78,
        "tons": 1391,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "31.02",
        "area": 3.96,
        "tch": 100.78,
        "tons": 399,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "31.03",
        "area": 13.05,
        "tch": 100.78,
        "tons": 1315,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "32.01",
        "area": 9.05,
        "tch": 100.78,
        "tons": 912,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "32.02",
        "area": 12.26,
        "tch": 100.78,
        "tons": 1236,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "32.03",
        "area": 5.52,
        "tch": 100.76,
        "tons": 556,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "32.04",
        "area": 10.59,
        "tch": 100.75,
        "tons": 1067,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "34.01",
        "area": 10.34,
        "tch": 104.46,
        "tons": 1080,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "35.01",
        "area": 12.66,
        "tch": 98.05,
        "tons": 1241,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "33.01",
        "area": 21.25,
        "tch": 94.19,
        "tons": 2001,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "37.01",
        "area": 14.57,
        "tch": 105.18,
        "tons": 1532,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "28.02",
        "area": 13.78,
        "tch": 100.78,
        "tons": 1389,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "LAS MARIAS ESTRADA",
    "code": "586",
    "lotes": [
      {
        "lote": "1.01",
        "area": 10.48,
        "tch": 82.14,
        "tons": 861,
        "variedad": "Mex79-431",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.41",
        "area": 1.7,
        "tch": 95.36,
        "tons": 162,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.75",
        "area": 16.48,
        "tch": 109.62,
        "tons": 1807,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.1",
        "area": 1.47,
        "tch": 100.81,
        "tons": 148,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.04",
        "area": 5.5,
        "tch": 82.55,
        "tons": 454,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.13",
        "area": 8.2,
        "tch": 130.86,
        "tons": 1073,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.15",
        "area": 5.14,
        "tch": 68.65,
        "tons": 353,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.14",
        "area": 4,
        "tch": 82.95,
        "tons": 332,
        "variedad": "CR87-339",
        "tipoCosecha": ""
      },
      {
        "lote": "2.01",
        "area": 10.79,
        "tch": 114.23,
        "tons": 1233,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.1",
        "area": 8.17,
        "tch": 188.05,
        "tons": 1536,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.06",
        "area": 2.61,
        "tch": 77.67,
        "tons": 203,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.09",
        "area": 1.2,
        "tch": 173.98,
        "tons": 209,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.6",
        "area": 5.7,
        "tch": 74.22,
        "tons": 423,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.03",
        "area": 18,
        "tch": 72.93,
        "tons": 1313,
        "variedad": "CR87-339",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.09",
        "area": 2,
        "tch": 75.23,
        "tons": 150,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.01",
        "area": 1.4,
        "tch": 97.77,
        "tons": 137,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.3",
        "area": 31.1,
        "tch": 103.1,
        "tons": 3206,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.02",
        "area": 1.1,
        "tch": 262.94,
        "tons": 289,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.03",
        "area": 3.15,
        "tch": 76.63,
        "tons": 241,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.04",
        "area": 8.54,
        "tch": 96.66,
        "tons": 825,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.11",
        "area": 2.4,
        "tch": 136.31,
        "tons": 327,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.37",
        "area": 5,
        "tch": 88.2,
        "tons": 441,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.06",
        "area": 3.55,
        "tch": 76.64,
        "tons": 272,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.22",
        "area": 3.8,
        "tch": 30.93,
        "tons": 118,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.17",
        "area": 3.65,
        "tch": 50.36,
        "tons": 184,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.12",
        "area": 4.5,
        "tch": 58.32,
        "tons": 262,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 2,
        "tch": 133.99,
        "tons": 268,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.32",
        "area": 3.27,
        "tch": 146.73,
        "tons": 480,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "2.15",
        "area": 2.45,
        "tch": 121.77,
        "tons": 298,
        "variedad": "CR87-339",
        "tipoCosecha": ""
      },
      {
        "lote": "3.03",
        "area": 1.1,
        "tch": 142.29,
        "tons": 157,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.02",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.04",
        "area": 3.8,
        "tch": 64.37,
        "tons": 245,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.05",
        "area": 5.67,
        "tch": 78.32,
        "tons": 444,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.07",
        "area": 2.45,
        "tch": 84.69,
        "tons": 207,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.11",
        "area": 2.3,
        "tch": 83.7,
        "tons": 193,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.63",
        "area": 16.36,
        "tch": 96.46,
        "tons": 1578,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.65",
        "area": 4.48,
        "tch": 122.57,
        "tons": 549,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.13",
        "area": 4.16,
        "tch": 84.12,
        "tons": 350,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "LAS MARIAS INAFEB",
    "code": "551",
    "lotes": [
      {
        "lote": "2.02",
        "area": 63.56,
        "tch": 130,
        "tons": 8263,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "2.04",
        "area": 46.84,
        "tch": 120,
        "tons": 5621,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "LAS MORENAS II",
    "code": "633",
    "lotes": [
      {
        "lote": "1.01",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte granel en verde"
      }
    ]
  },
  {
    "name": "LAS PALMAS",
    "code": "3",
    "lotes": [
      {
        "lote": "3.01",
        "area": 94.33,
        "tch": 92.86,
        "tons": 8760,
        "variedad": "CG12-116",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.02",
        "area": 114.12,
        "tch": 89.02,
        "tons": 8552,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "LOS ENCUENTROS INAFEB",
    "code": "552",
    "lotes": [
      {
        "lote": "5.01",
        "area": 94.02,
        "tch": 134.88,
        "tons": 12681,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "LOS TARROS",
    "code": "2",
    "lotes": [
      {
        "lote": "2.29",
        "area": 8.71,
        "tch": 88.02,
        "tons": 767,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.87",
        "area": 7.53,
        "tch": 92.89,
        "tons": 699,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.18",
        "area": 15.61,
        "tch": 95.23,
        "tons": 1486,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.1",
        "area": 13.49,
        "tch": 103.13,
        "tons": 1391,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.07",
        "area": 7.77,
        "tch": 73.07,
        "tons": 568,
        "variedad": "CG01-53",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.06",
        "area": 14.48,
        "tch": 96.84,
        "tons": 1402,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.32",
        "area": 10.7,
        "tch": 88.8,
        "tons": 950,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.4",
        "area": 6.86,
        "tch": 88.18,
        "tons": 605,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.41",
        "area": 40.31,
        "tch": 87.45,
        "tons": 3525,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.43",
        "area": 12.71,
        "tch": 79.64,
        "tons": 1012,
        "variedad": "CG09-06020",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.44",
        "area": 14.36,
        "tch": 95.1,
        "tons": 1366,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.59",
        "area": 4.96,
        "tch": 66.13,
        "tons": 328,
        "variedad": "CG09-06020",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.6",
        "area": 5.63,
        "tch": 63.9,
        "tons": 360,
        "variedad": "CG09-05327",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.83",
        "area": 15.66,
        "tch": 97.5,
        "tons": 1527,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.27",
        "area": 8.68,
        "tch": 81.04,
        "tons": 703,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.94",
        "area": 23.47,
        "tch": 113.43,
        "tons": 2662,
        "variedad": "SP80-1842",
        "tipoCosecha": ""
      },
      {
        "lote": "2.96",
        "area": 20.37,
        "tch": 106.26,
        "tons": 2164,
        "variedad": "CG09-06020",
        "tipoCosecha": ""
      },
      {
        "lote": "2.97",
        "area": 17.24,
        "tch": 90.18,
        "tons": 1555,
        "variedad": "CG06-00894",
        "tipoCosecha": ""
      },
      {
        "lote": "2.35",
        "area": 9.78,
        "tch": 78.15,
        "tons": 764,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.24",
        "area": 15.66,
        "tch": 96.09,
        "tons": 1505,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.19",
        "area": 5.55,
        "tch": 95.32,
        "tons": 529,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.51",
        "area": 10.43,
        "tch": 92.1,
        "tons": 961,
        "variedad": "CG00-082",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.78",
        "area": 6.21,
        "tch": 89.1,
        "tons": 553,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.88",
        "area": 11.57,
        "tch": 133.18,
        "tons": 1541,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.89",
        "area": 8.59,
        "tch": 106.56,
        "tons": 915,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.31",
        "area": 13.8,
        "tch": 96.14,
        "tons": 1327,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.33",
        "area": 7,
        "tch": 90.82,
        "tons": 636,
        "variedad": "CG03-138",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.36",
        "area": 7.64,
        "tch": 84.37,
        "tons": 645,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.34",
        "area": 11.95,
        "tch": 96.53,
        "tons": 1154,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.75",
        "area": 4.48,
        "tch": 98.28,
        "tons": 440,
        "variedad": "Varias",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.11",
        "area": 8.86,
        "tch": 104.26,
        "tons": 924,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.12",
        "area": 9.32,
        "tch": 93.85,
        "tons": 875,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.21",
        "area": 17.84,
        "tch": 98.98,
        "tons": 1766,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.9",
        "area": 9.15,
        "tch": 98.27,
        "tons": 899,
        "variedad": "CG03-138",
        "tipoCosecha": ""
      },
      {
        "lote": "2.91",
        "area": 6.47,
        "tch": 116.3,
        "tons": 752,
        "variedad": "CG09-05327",
        "tipoCosecha": ""
      },
      {
        "lote": "2.92",
        "area": 9.31,
        "tch": 112.37,
        "tons": 1046,
        "variedad": "CG09-133119",
        "tipoCosecha": ""
      },
      {
        "lote": "2.5",
        "area": 46.78,
        "tch": 117.01,
        "tons": 5474,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.09",
        "area": 6.2,
        "tch": 83.88,
        "tons": 520,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.76",
        "area": 10.99,
        "tch": 101.48,
        "tons": 1115,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.42",
        "area": 14.17,
        "tch": 80.71,
        "tons": 1144,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.61",
        "area": 9.43,
        "tch": 69.43,
        "tons": 655,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.62",
        "area": 5.37,
        "tch": 68.16,
        "tons": 366,
        "variedad": "CG06-08105",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.45",
        "area": 12.22,
        "tch": 71.29,
        "tons": 871,
        "variedad": "CG09-06020",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.67",
        "area": 13.5,
        "tch": 93.25,
        "tons": 1259,
        "variedad": "CG00-082",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.46",
        "area": 34.97,
        "tch": 76.59,
        "tons": 2678,
        "variedad": "CG09-06020",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.38",
        "area": 20.48,
        "tch": 84.5,
        "tons": 1730,
        "variedad": "Varias",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.22",
        "area": 6.45,
        "tch": 69.43,
        "tons": 448,
        "variedad": "CG09-133138",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.13",
        "area": 6.42,
        "tch": 112.09,
        "tons": 720,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.85",
        "area": 5.81,
        "tch": 96.1,
        "tons": 558,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.56",
        "area": 10.55,
        "tch": 113.78,
        "tons": 1200,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.84",
        "area": 17.3,
        "tch": 116.08,
        "tons": 2008,
        "variedad": "CG03-138",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.7",
        "area": 4.9,
        "tch": 112.9,
        "tons": 553,
        "variedad": "CG06-00894",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.99",
        "area": 18.84,
        "tch": 105.95,
        "tons": 1996,
        "variedad": "CG09-133119",
        "tipoCosecha": ""
      },
      {
        "lote": "2.98",
        "area": 7.97,
        "tch": 109.03,
        "tons": 869,
        "variedad": "SP80-1842",
        "tipoCosecha": ""
      },
      {
        "lote": "2.86",
        "area": 5.97,
        "tch": 97.04,
        "tons": 579,
        "variedad": "CG09-05327",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.8",
        "area": 4.97,
        "tch": 92.95,
        "tons": 462,
        "variedad": "CG09-06020",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.3",
        "area": 13.12,
        "tch": 95,
        "tons": 1246,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.47",
        "area": 16.19,
        "tch": 87.54,
        "tons": 1417,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.37",
        "area": 12.16,
        "tch": 81.43,
        "tons": 990,
        "variedad": "CG06-08105",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.48",
        "area": 12.22,
        "tch": 105.58,
        "tons": 1290,
        "variedad": "CG06-05360",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.49",
        "area": 32.08,
        "tch": 87.43,
        "tons": 2805,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.69",
        "area": 10.45,
        "tch": 113.09,
        "tons": 1182,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.68",
        "area": 6.89,
        "tch": 106.57,
        "tons": 734,
        "variedad": "CG09-06020",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.79",
        "area": 8.23,
        "tch": 64.89,
        "tons": 534,
        "variedad": "CG06-00894",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.93",
        "area": 7.41,
        "tch": 87.66,
        "tons": 650,
        "variedad": "CG09-06020",
        "tipoCosecha": ""
      },
      {
        "lote": "2.81",
        "area": 13.83,
        "tch": 93.36,
        "tons": 1291,
        "variedad": "CG03-138",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.52",
        "area": 7.56,
        "tch": 106.57,
        "tons": 806,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.25",
        "area": 9.04,
        "tch": 98.11,
        "tons": 887,
        "variedad": "Varias",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.2",
        "area": 10.79,
        "tch": 88.75,
        "tons": 958,
        "variedad": "CG06-00894",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.03",
        "area": 8.43,
        "tch": 84.72,
        "tons": 714,
        "variedad": "Varias",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.39",
        "area": 2.42,
        "tch": 71.79,
        "tons": 174,
        "variedad": "Varias",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.05",
        "area": 6.9,
        "tch": 78.04,
        "tons": 539,
        "variedad": "Varias",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.64",
        "area": 14.31,
        "tch": 74.5,
        "tons": 1066,
        "variedad": "SP79-2233",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.63",
        "area": 6.85,
        "tch": 102,
        "tons": 699,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.08",
        "area": 7.89,
        "tch": 95.99,
        "tons": 757,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.66",
        "area": 5.31,
        "tch": 84.63,
        "tons": 449,
        "variedad": "Varias",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.17",
        "area": 5.11,
        "tch": 93.71,
        "tons": 479,
        "variedad": "CG03-138",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.15",
        "area": 9.89,
        "tch": 95.61,
        "tons": 946,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.28",
        "area": 13.04,
        "tch": 80.62,
        "tons": 1051,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.77",
        "area": 12.11,
        "tch": 69.07,
        "tons": 836,
        "variedad": "SP79-2233",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.73",
        "area": 7.09,
        "tch": 79.09,
        "tons": 561,
        "variedad": "Varias",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.58",
        "area": 11.14,
        "tch": 68.17,
        "tons": 759,
        "variedad": "Varias",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.57",
        "area": 4.09,
        "tch": 71.14,
        "tons": 291,
        "variedad": "CG06-00894",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.82",
        "area": 11.13,
        "tch": 79.62,
        "tons": 886,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.95",
        "area": 9.29,
        "tch": 103.96,
        "tons": 966,
        "variedad": "SP80-1842",
        "tipoCosecha": ""
      },
      {
        "lote": "2.54",
        "area": 6.14,
        "tch": 58,
        "tons": 356,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.53",
        "area": 6.71,
        "tch": 90.2,
        "tons": 605,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.65",
        "area": 14.22,
        "tch": 74.36,
        "tons": 1057,
        "variedad": "SP79-2233",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.74",
        "area": 31.97,
        "tch": 71.18,
        "tons": 2276,
        "variedad": "SP79-2233",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.55",
        "area": 8.93,
        "tch": 78.78,
        "tons": 704,
        "variedad": "CG06-05360",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.72",
        "area": 31.03,
        "tch": 87.38,
        "tons": 2711,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.71",
        "area": 8.78,
        "tch": 87.15,
        "tons": 765,
        "variedad": "CG06-00894",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.01",
        "area": 11.85,
        "tch": 89.63,
        "tons": 1062,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.02",
        "area": 14.04,
        "tch": 95.46,
        "tons": 1340,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.04",
        "area": 15.54,
        "tch": 92.07,
        "tons": 1431,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.14",
        "area": 11.64,
        "tch": 86.94,
        "tons": 1012,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.16",
        "area": 11.52,
        "tch": 88.59,
        "tons": 1021,
        "variedad": "SP80-1842",
        "tipoCosecha": "Corte granel quemado minimaleta"
      },
      {
        "lote": "2.23",
        "area": 7.78,
        "tch": 80.22,
        "tons": 624,
        "variedad": "CG03-138",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      },
      {
        "lote": "2.26",
        "area": 9.31,
        "tch": 88.89,
        "tons": 828,
        "variedad": "CG09-133119",
        "tipoCosecha": "Corte maleteado s/carreta en quemado"
      }
    ]
  },
  {
    "name": "MANGALES  CAJON",
    "code": "238",
    "lotes": [
      {
        "lote": "1.14",
        "area": 2.15,
        "tch": 79.6,
        "tons": 171,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.22",
        "area": 0.65,
        "tch": 65.8,
        "tons": 43,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.26",
        "area": 0.72,
        "tch": 80.76,
        "tons": 58,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.01",
        "area": 1.37,
        "tch": 100.49,
        "tons": 138,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "2.02",
        "area": 2.48,
        "tch": 88.43,
        "tons": 219,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "2.03",
        "area": 2.13,
        "tch": 96.15,
        "tons": 205,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "2.04",
        "area": 0.67,
        "tch": 97.31,
        "tons": 65,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "2.05",
        "area": 1.26,
        "tch": 114.59,
        "tons": 144,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "2.06",
        "area": 2.17,
        "tch": 106.42,
        "tons": 231,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "2.07",
        "area": 2.97,
        "tch": 91.8,
        "tons": 273,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "2.08",
        "area": 0.83,
        "tch": 96.69,
        "tons": 80,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "2.09",
        "area": 1.99,
        "tch": 120.3,
        "tons": 239,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "1.09",
        "area": 3.55,
        "tch": 120.23,
        "tons": 427,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.05",
        "area": 2.15,
        "tch": 56.29,
        "tons": 121,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.06",
        "area": 4.35,
        "tch": 113.89,
        "tons": 495,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.07",
        "area": 5.79,
        "tch": 129.88,
        "tons": 752,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.04",
        "area": 4.36,
        "tch": 112.78,
        "tons": 492,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.12",
        "area": 4.28,
        "tch": 112.75,
        "tons": 483,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.13",
        "area": 5.86,
        "tch": 108.43,
        "tons": 635,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.17",
        "area": 7.2,
        "tch": 104.31,
        "tons": 751,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.18",
        "area": 1.49,
        "tch": 117.7,
        "tons": 175,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.1",
        "area": 3.95,
        "tch": 95.41,
        "tons": 377,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.16",
        "area": 5.14,
        "tch": 118.62,
        "tons": 610,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.11",
        "area": 6.11,
        "tch": 130.51,
        "tons": 797,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.15",
        "area": 3.36,
        "tch": 115.09,
        "tons": 387,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.2",
        "area": 3.69,
        "tch": 157.8,
        "tons": 582,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.21",
        "area": 1.43,
        "tch": 111.15,
        "tons": 159,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.24",
        "area": 3.25,
        "tch": 189.8,
        "tons": 617,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.25",
        "area": 1.9,
        "tch": 111.2,
        "tons": 211,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.23",
        "area": 2.24,
        "tch": 116.42,
        "tons": 261,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.28",
        "area": 3.12,
        "tch": 103.4,
        "tons": 323,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.19",
        "area": 2.19,
        "tch": 130.2,
        "tons": 285,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.27",
        "area": 3,
        "tch": 167.41,
        "tons": 502,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "MANGALES MAPAN UNION",
    "code": "23",
    "lotes": [
      {
        "lote": "23.02",
        "area": 100.29,
        "tch": 106.52,
        "tons": 10683,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "23.01",
        "area": 26.15,
        "tch": 94.32,
        "tons": 2466,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "MARGARITAS",
    "code": "4",
    "lotes": [
      {
        "lote": "4.1",
        "area": 55.11,
        "tch": 115.67,
        "tons": 6326,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.07",
        "area": 29.86,
        "tch": 87.86,
        "tons": 2344,
        "variedad": "RB845210",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.09",
        "area": 74.23,
        "tch": 90.21,
        "tons": 6281,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.08",
        "area": 113.01,
        "tch": 125.9,
        "tons": 14213,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.03",
        "area": 54.82,
        "tch": 121.66,
        "tons": 6669,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.05",
        "area": 41.2,
        "tch": 71.58,
        "tons": 2949,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.06",
        "area": 18.91,
        "tch": 81.04,
        "tons": 1533,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "4.01",
        "area": 190.31,
        "tch": 81,
        "tons": 15291,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.02",
        "area": 252.64,
        "tch": 100.8,
        "tons": 25385,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.04",
        "area": 178.42,
        "tch": 104.71,
        "tons": 18673,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.11",
        "area": 52.49,
        "tch": 122.58,
        "tons": 1469,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "MONTE ALEGRE",
    "code": "17",
    "lotes": [
      {
        "lote": "17.03",
        "area": 81.86,
        "tch": 130.39,
        "tons": 10674,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.02",
        "area": 33.85,
        "tch": 92.11,
        "tons": 3118,
        "variedad": "CG98-78",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.1",
        "area": 141.93,
        "tch": 102.34,
        "tons": 14525,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.04",
        "area": 72.94,
        "tch": 124.77,
        "tons": 9101,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.08",
        "area": 118.83,
        "tch": 121.25,
        "tons": 14409,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.17",
        "area": 94.64,
        "tch": 129.16,
        "tons": 12224,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.14",
        "area": 86.58,
        "tch": 104.75,
        "tons": 1325,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "17.07",
        "area": 61.69,
        "tch": 113.92,
        "tons": 7028,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.09",
        "area": 78.76,
        "tch": 95.67,
        "tons": 7535,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.16",
        "area": 51.4,
        "tch": 108.48,
        "tons": 5576,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.06",
        "area": 64.3,
        "tch": 114.88,
        "tons": 7387,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.05",
        "area": 97.58,
        "tch": 112.87,
        "tons": 11014,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.01",
        "area": 91.64,
        "tch": 98.67,
        "tons": 9042,
        "variedad": "CG98-78",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.14",
        "area": 86.58,
        "tch": 127.53,
        "tons": 5127,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.13 A",
        "area": 387.87,
        "tch": 116.62,
        "tons": 45163,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.11",
        "area": 130.08,
        "tch": 137.89,
        "tons": 17937,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "17.12",
        "area": 11.58,
        "tch": 142.49,
        "tons": 1650,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "17.13 B",
        "area": 387.87,
        "tch": 116.62,
        "tons": 45163,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "OFELIA",
    "code": "631",
    "lotes": [
      {
        "lote": "1.03",
        "area": 3.82,
        "tch": 41.44,
        "tons": 158,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.14",
        "area": 2.62,
        "tch": 32.09,
        "tons": 84,
        "variedad": "CP73-1547",
        "tipoCosecha": ""
      },
      {
        "lote": "1.11",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.15",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "1.13",
        "area": 2.73,
        "tch": 33.65,
        "tons": 92,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.12",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.07",
        "area": 3.06,
        "tch": 41.93,
        "tons": 128,
        "variedad": "SP71-6161",
        "tipoCosecha": ""
      },
      {
        "lote": "2.18",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "2.19",
        "area": 2.29,
        "tch": 60.38,
        "tons": 138,
        "variedad": "CP73-1547",
        "tipoCosecha": ""
      },
      {
        "lote": "3.11",
        "area": 5.7,
        "tch": 22.98,
        "tons": 131,
        "variedad": "SP71-6161",
        "tipoCosecha": ""
      },
      {
        "lote": "3.13",
        "area": 4.01,
        "tch": 27.04,
        "tons": 108,
        "variedad": "VARIAS",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.15",
        "area": 5.53,
        "tch": 20.26,
        "tons": 112,
        "variedad": "CP73-1547",
        "tipoCosecha": ""
      },
      {
        "lote": "2.06",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "2.08",
        "area": 3.27,
        "tch": 49.29,
        "tons": 161,
        "variedad": "SP71-6161",
        "tipoCosecha": ""
      },
      {
        "lote": "2.12",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "2.1",
        "area": 3.01,
        "tch": 68.35,
        "tons": 206,
        "variedad": "SP71-6161",
        "tipoCosecha": ""
      },
      {
        "lote": "1.06",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.08",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.09",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.1",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.05",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "PARCELA # 47",
    "code": "444",
    "lotes": [
      {
        "lote": "2.05",
        "area": 3.38,
        "tch": 68.8,
        "tons": 233,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.04",
        "area": 1.46,
        "tch": 141.31,
        "tons": 206,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.03",
        "area": 5,
        "tch": 138.42,
        "tons": 692,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.02",
        "area": 3.38,
        "tch": 142.93,
        "tons": 483,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.01",
        "area": 2.57,
        "tch": 109.48,
        "tons": 249,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.03",
        "area": 3.67,
        "tch": 78,
        "tons": 286,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.02",
        "area": 8.67,
        "tch": 103.84,
        "tons": 900,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.01",
        "area": 4.4,
        "tch": 86.39,
        "tons": 380,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "PARCELA CONTRERAS",
    "code": "567",
    "lotes": [
      {
        "lote": "1.01",
        "area": 7,
        "tch": 93.1,
        "tons": 652,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "PARCELA LAS DIAMELAS",
    "code": "408",
    "lotes": [
      {
        "lote": "1.04",
        "area": 1.4,
        "tch": 114.48,
        "tons": 160,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.01",
        "area": 3.5,
        "tch": 105.27,
        "tons": 368,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 1.2,
        "tch": 86.53,
        "tons": 104,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.01",
        "area": 1.9,
        "tch": 138.5,
        "tons": 263,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.05",
        "area": 3.2,
        "tch": 77.45,
        "tons": 248,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "PARCELA ORO VERDE",
    "code": "236",
    "lotes": [
      {
        "lote": "1.03",
        "area": 2.57,
        "tch": 117.64,
        "tons": 302,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.01",
        "area": 10.5,
        "tch": 129.58,
        "tons": 1361,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 8.78,
        "tch": 108.54,
        "tons": 953,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "PARCELA PALONES",
    "code": "545",
    "lotes": [
      {
        "lote": "1.01",
        "area": 4.1,
        "tch": 114.11,
        "tons": 468,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.02",
        "area": 3,
        "tch": 101.45,
        "tons": 304,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.03",
        "area": 8.58,
        "tch": 103.24,
        "tons": 886,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "PARCELAS INAFEB",
    "code": "537",
    "lotes": [
      {
        "lote": "1.23",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.21",
        "area": 18.59,
        "tch": 95,
        "tons": 1766,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.2",
        "area": 24.38,
        "tch": 110,
        "tons": 2682,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.19",
        "area": 19.53,
        "tch": 80,
        "tons": 1562,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.13",
        "area": 11.24,
        "tch": 110,
        "tons": 1236,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "PARCELAS NUEVA CONCEPCION",
    "code": "32",
    "lotes": [
      {
        "lote": "32.02",
        "area": 44.47,
        "tch": 120.06,
        "tons": 5339,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.03",
        "area": 17.46,
        "tch": 129.38,
        "tons": 2259,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.04",
        "area": 18.56,
        "tch": 105.49,
        "tons": 1958,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.05",
        "area": 26.8,
        "tch": 101.62,
        "tons": 2724,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.06",
        "area": 17.18,
        "tch": 138.3,
        "tons": 2279,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.08",
        "area": 17.79,
        "tch": 105.45,
        "tons": 1517,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.09",
        "area": 33.68,
        "tch": 131.62,
        "tons": 4387,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.1",
        "area": 16.01,
        "tch": 91.85,
        "tons": 1471,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.12",
        "area": 8.7,
        "tch": 135.59,
        "tons": 1180,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.13",
        "area": 17.81,
        "tch": 130.87,
        "tons": 2331,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.14",
        "area": 18.26,
        "tch": 138.38,
        "tons": 2527,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.15",
        "area": 18.25,
        "tch": 138.59,
        "tons": 2529,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "32.01",
        "area": 31.83,
        "tch": 109.56,
        "tons": 3482,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "32.11",
        "area": 17.48,
        "tch": 30.73,
        "tons": 537,
        "variedad": "Varias",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "PERALTA",
    "code": "38",
    "lotes": [
      {
        "lote": "38.02",
        "area": 91.26,
        "tch": 132.33,
        "tons": 12076,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "38.03",
        "area": 33.69,
        "tch": 94.17,
        "tons": 3173,
        "variedad": "SP83-2847",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "38.06",
        "area": 64.48,
        "tch": 96.02,
        "tons": 6158,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "38.01",
        "area": 79.14,
        "tch": 106.11,
        "tons": 8397,
        "variedad": "RB845210",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "38.04",
        "area": 89.59,
        "tch": 133.16,
        "tons": 11930,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "38.05",
        "area": 94.42,
        "tch": 112.62,
        "tons": 10633,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "PUYUMATE",
    "code": "65",
    "lotes": [
      {
        "lote": "65.04",
        "area": 42.95,
        "tch": 96.36,
        "tons": 4139,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "65.02",
        "area": 34.39,
        "tch": 84.33,
        "tons": 2900,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "65.03",
        "area": 53.7,
        "tch": 95.49,
        "tons": 5109,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "65.05",
        "area": 63.41,
        "tch": 137.29,
        "tons": 8706,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "65.07",
        "area": 6.61,
        "tch": 106.12,
        "tons": 701,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "65.06",
        "area": 18.3,
        "tch": 108.06,
        "tons": 1977,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "65.09",
        "area": 7.15,
        "tch": 78.69,
        "tons": 563,
        "variedad": "Varias",
        "tipoCosecha": ""
      },
      {
        "lote": "65.1",
        "area": 106.57,
        "tch": 112.57,
        "tons": 11997,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "65.08",
        "area": 19.29,
        "tch": 125.52,
        "tons": 2421,
        "variedad": "Varias",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "RANCHO MARGARITAS LU",
    "code": "62",
    "lotes": [
      {
        "lote": "62.02",
        "area": 130.77,
        "tch": 95.44,
        "tons": 12480,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "62.01",
        "area": 44.25,
        "tch": 135.76,
        "tons": 6007,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "62.03",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "REFUGIO NUEVO",
    "code": "60",
    "lotes": [
      {
        "lote": "60.01",
        "area": 57.76,
        "tch": 99,
        "tons": 5718,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "60.02",
        "area": 60.99,
        "tch": 104.03,
        "tons": 6345,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "60.03",
        "area": 118.8,
        "tch": 101.74,
        "tons": 12086,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "REFUGIO VIEJO",
    "code": "15",
    "lotes": [
      {
        "lote": "15.01",
        "area": 16,
        "tch": 123.22,
        "tons": 1972,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "15.03",
        "area": 46.95,
        "tch": 119.89,
        "tons": 5629,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "15.05",
        "area": 54.64,
        "tch": 146.1,
        "tons": 7983,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.06",
        "area": 111.82,
        "tch": 136.8,
        "tons": 15260,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "15.02",
        "area": 112.56,
        "tch": 123.83,
        "tons": 13938,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "15.04",
        "area": 16.19,
        "tch": 60.05,
        "tons": 57,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "RIOL S.A.",
    "code": "602",
    "lotes": [
      {
        "lote": "2.1102",
        "area": 19.15,
        "tch": 159.53,
        "tons": 3055,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1104",
        "area": 14.96,
        "tch": 151.81,
        "tons": 2271,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1106",
        "area": 11.75,
        "tch": 125.9,
        "tons": 1479,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1105",
        "area": 21.94,
        "tch": 159.26,
        "tons": 3494,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1107",
        "area": 20.79,
        "tch": 173.18,
        "tons": 3600,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1108",
        "area": 10.16,
        "tch": 131.86,
        "tons": 1340,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0605",
        "area": 18.86,
        "tch": 123.05,
        "tons": 2321,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0603",
        "area": 21.09,
        "tch": 135.29,
        "tons": 2853,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0604",
        "area": 27.87,
        "tch": 161.28,
        "tons": 4495,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0602",
        "area": 14.33,
        "tch": 164.93,
        "tons": 2363,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0601",
        "area": 10.24,
        "tch": 151.01,
        "tons": 1546,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0401",
        "area": 14.09,
        "tch": 144.94,
        "tons": 2042,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0402",
        "area": 11.22,
        "tch": 144.94,
        "tons": 1626,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0403",
        "area": 26.02,
        "tch": 144.94,
        "tons": 3771,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0404",
        "area": 14.63,
        "tch": 144.94,
        "tons": 2120,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0405",
        "area": 9.59,
        "tch": 144.94,
        "tons": 1390,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0406",
        "area": 19.66,
        "tch": 144.94,
        "tons": 2850,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0701",
        "area": 18.44,
        "tch": 150,
        "tons": 2766,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0702",
        "area": 25.14,
        "tch": 150,
        "tons": 3771,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0703",
        "area": 19.1,
        "tch": 150,
        "tons": 2865,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "2.1101",
        "area": 13.53,
        "tch": 136.64,
        "tons": 1849,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1103",
        "area": 16.02,
        "tch": 147.38,
        "tons": 2361,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0701",
        "area": 6.98,
        "tch": 145.4,
        "tons": 1015,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0703",
        "area": 7.19,
        "tch": 174.36,
        "tons": 1254,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0705",
        "area": 7.23,
        "tch": 151.65,
        "tons": 1096,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0707",
        "area": 7.21,
        "tch": 152.56,
        "tons": 1100,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0709",
        "area": 6.86,
        "tch": 162.03,
        "tons": 1112,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0711",
        "area": 6.83,
        "tch": 132.93,
        "tons": 908,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0713",
        "area": 6.85,
        "tch": 136,
        "tons": 932,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0715",
        "area": 6.67,
        "tch": 190.6,
        "tons": 1271,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0702",
        "area": 11.73,
        "tch": 180.84,
        "tons": 2121,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0704",
        "area": 7.49,
        "tch": 167.06,
        "tons": 1251,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0706",
        "area": 3.45,
        "tch": 189.16,
        "tons": 653,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0708",
        "area": 4.64,
        "tch": 139.18,
        "tons": 646,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.071",
        "area": 8.25,
        "tch": 184.86,
        "tons": 1525,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0712",
        "area": 12.22,
        "tch": 161.31,
        "tons": 1971,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0704",
        "area": 23.28,
        "tch": 150,
        "tons": 3492,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "2.0714",
        "area": 15.57,
        "tch": 164.13,
        "tons": 2555,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0716",
        "area": 12,
        "tch": 137.74,
        "tons": 1653,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0501",
        "area": 21.25,
        "tch": 178.42,
        "tons": 3791,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0502",
        "area": 4.34,
        "tch": 184.99,
        "tons": 803,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0504",
        "area": 21.55,
        "tch": 151.46,
        "tons": 3264,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0103",
        "area": 7.72,
        "tch": 152.93,
        "tons": 1181,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "4.0106",
        "area": 25.35,
        "tch": 137.66,
        "tons": 3490,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0203",
        "area": 14.61,
        "tch": 172.44,
        "tons": 2519,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0204",
        "area": 5.46,
        "tch": 202.67,
        "tons": 1107,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0205",
        "area": 17.32,
        "tch": 182.53,
        "tons": 3161,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0206",
        "area": 4.46,
        "tch": 201.38,
        "tons": 898,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0305",
        "area": 5.29,
        "tch": 167.45,
        "tons": 886,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0306",
        "area": 5.34,
        "tch": 161.36,
        "tons": 862,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0307",
        "area": 6.9,
        "tch": 140.57,
        "tons": 970,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0308",
        "area": 3.91,
        "tch": 185.94,
        "tons": 727,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0501",
        "area": 12.84,
        "tch": 154.97,
        "tons": 1990,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0502",
        "area": 14.29,
        "tch": 165.49,
        "tons": 55,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0503",
        "area": 13.24,
        "tch": 156.72,
        "tons": 2075,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0504",
        "area": 14.21,
        "tch": 127.04,
        "tons": 1805,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0505",
        "area": 13.45,
        "tch": 182.02,
        "tons": 2448,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0506",
        "area": 14.41,
        "tch": 172.52,
        "tons": 2486,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0507",
        "area": 14.57,
        "tch": 138.3,
        "tons": 2015,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0508",
        "area": 14.6,
        "tch": 158.01,
        "tons": 2307,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0506",
        "area": 19.88,
        "tch": 146.06,
        "tons": 2904,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0508",
        "area": 15.51,
        "tch": 176.94,
        "tons": 2744,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.051",
        "area": 8.71,
        "tch": 133.67,
        "tons": 1164,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0601",
        "area": 4.46,
        "tch": 159.38,
        "tons": 711,
        "variedad": "CG98-46",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0602",
        "area": 9.5,
        "tch": 128.07,
        "tons": 1217,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0603",
        "area": 10.28,
        "tch": 157,
        "tons": 1614,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0606",
        "area": 8.25,
        "tch": 124.07,
        "tons": 1024,
        "variedad": "CG98-46",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0607",
        "area": 12.65,
        "tch": 159.6,
        "tons": 2019,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0608",
        "area": 7.02,
        "tch": 170.68,
        "tons": 1198,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0201",
        "area": 14.15,
        "tch": 161.18,
        "tons": 2281,
        "variedad": "CG04-0587",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0202",
        "area": 14.02,
        "tch": 185.12,
        "tons": 2595,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0203",
        "area": 16,
        "tch": 164.66,
        "tons": 2635,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0204",
        "area": 14.58,
        "tch": 87.85,
        "tons": 1281,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0205",
        "area": 14.31,
        "tch": 111.61,
        "tons": 1597,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0206",
        "area": 13.32,
        "tch": 100.81,
        "tons": 1343,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0207",
        "area": 14.83,
        "tch": 154.3,
        "tons": 2288,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0208",
        "area": 15,
        "tch": 152.15,
        "tons": 2282,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0209",
        "area": 14.17,
        "tch": 163.33,
        "tons": 2314,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.021",
        "area": 13.58,
        "tch": 181.41,
        "tons": 2464,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0211",
        "area": 14.56,
        "tch": 144.86,
        "tons": 2109,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0212",
        "area": 13.9,
        "tch": 149.52,
        "tons": 2078,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0113",
        "area": 9.9,
        "tch": 149.19,
        "tons": 1477,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0114",
        "area": 4.49,
        "tch": 107.66,
        "tons": 483,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0801",
        "area": 15.06,
        "tch": 182.94,
        "tons": 2755,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0802",
        "area": 14.36,
        "tch": 144.18,
        "tons": 2070,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0803",
        "area": 14.96,
        "tch": 144.39,
        "tons": 2160,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0804",
        "area": 14.13,
        "tch": 149.69,
        "tons": 2115,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0805",
        "area": 15.28,
        "tch": 174.25,
        "tons": 2663,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0806",
        "area": 14.14,
        "tch": 146.32,
        "tons": 2069,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0807",
        "area": 14.58,
        "tch": 148.17,
        "tons": 2160,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0808",
        "area": 24.38,
        "tch": 145.66,
        "tons": 3551,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0809",
        "area": 8.84,
        "tch": 129.96,
        "tons": 1149,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.081",
        "area": 7,
        "tch": 135.92,
        "tons": 951,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1001",
        "area": 1.94,
        "tch": 129.07,
        "tons": 250,
        "variedad": "CG04-0587",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.1002",
        "area": 5.58,
        "tch": 117.29,
        "tons": 654,
        "variedad": "CG04-0587",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1003",
        "area": 4.88,
        "tch": 148.71,
        "tons": 726,
        "variedad": "CG98-46",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1004",
        "area": 8.16,
        "tch": 122.38,
        "tons": 999,
        "variedad": "CG04-0587",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1005",
        "area": 7.69,
        "tch": 134.06,
        "tons": 1031,
        "variedad": "CG98-46",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1006",
        "area": 10.91,
        "tch": 122.1,
        "tons": 1332,
        "variedad": "CG04-0587",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1007",
        "area": 10.21,
        "tch": 158.98,
        "tons": 1623,
        "variedad": "CG98-46",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1008",
        "area": 11.56,
        "tch": 136.44,
        "tons": 1577,
        "variedad": "CG04-0587",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1009",
        "area": 10.37,
        "tch": 124.34,
        "tons": 1289,
        "variedad": "CG98-46",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.101",
        "area": 10.14,
        "tch": 110.43,
        "tons": 1120,
        "variedad": "CG04-0587",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.1011",
        "area": 9.46,
        "tch": 110.51,
        "tons": 1045,
        "variedad": "CG98-46",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1107",
        "area": 11.53,
        "tch": 182.53,
        "tons": 2105,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1108",
        "area": 23.62,
        "tch": 148.88,
        "tons": 3517,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1109",
        "area": 18.92,
        "tch": 119.03,
        "tons": 2252,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.111",
        "area": 12.21,
        "tch": 153.77,
        "tons": 1878,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1111",
        "area": 7.15,
        "tch": 178.66,
        "tons": 1277,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1112",
        "area": 5.63,
        "tch": 139.76,
        "tons": 787,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1113",
        "area": 28.17,
        "tch": 148.03,
        "tons": 4170,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1003",
        "area": 11.07,
        "tch": 115.27,
        "tons": 1276,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1005",
        "area": 24.21,
        "tch": 150.89,
        "tons": 3653,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1006",
        "area": 11.92,
        "tch": 150.7,
        "tons": 1796,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1007",
        "area": 18.18,
        "tch": 154.45,
        "tons": 2808,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1101",
        "area": 7.23,
        "tch": 139.53,
        "tons": 1009,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1102",
        "area": 10.02,
        "tch": 100.93,
        "tons": 1011,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1103",
        "area": 20.01,
        "tch": 147.71,
        "tons": 2956,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1104",
        "area": 20.23,
        "tch": 133.04,
        "tons": 2691,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1105",
        "area": 23.12,
        "tch": 170.41,
        "tons": 3940,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1106",
        "area": 12.17,
        "tch": 148.62,
        "tons": 1809,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0902",
        "area": 20.43,
        "tch": 167.13,
        "tons": 3415,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0904",
        "area": 28.13,
        "tch": 138.47,
        "tons": 3895,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0905",
        "area": 10.5,
        "tch": 145.1,
        "tons": 1524,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0907",
        "area": 15.65,
        "tch": 129.42,
        "tons": 2025,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0908",
        "area": 6.26,
        "tch": 151.41,
        "tons": 948,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0911",
        "area": 2.96,
        "tch": 125.53,
        "tons": 372,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0914",
        "area": 4.58,
        "tch": 151.18,
        "tons": 692,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0918",
        "area": 5.83,
        "tch": 176.31,
        "tons": 1028,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1001",
        "area": 23.39,
        "tch": 152.11,
        "tons": 3558,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1002",
        "area": 16.66,
        "tch": 168.46,
        "tons": 2807,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.1004",
        "area": 2.43,
        "tch": 172.81,
        "tons": 420,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0301",
        "area": 8.66,
        "tch": 152.02,
        "tons": 1316,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0302",
        "area": 14.58,
        "tch": 163.58,
        "tons": 2385,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0303",
        "area": 12.23,
        "tch": 152.49,
        "tons": 1865,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0304",
        "area": 12.5,
        "tch": 153.45,
        "tons": 1918,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0305",
        "area": 13.27,
        "tch": 163.84,
        "tons": 2174,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0306",
        "area": 18.14,
        "tch": 130.51,
        "tons": 2367,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0603",
        "area": 9.05,
        "tch": 157.34,
        "tons": 1424,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0604",
        "area": 24.87,
        "tch": 159.69,
        "tons": 3972,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0606",
        "area": 9.26,
        "tch": 95.7,
        "tons": 886,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0607",
        "area": 27.73,
        "tch": 153.59,
        "tons": 4259,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0609",
        "area": 10.92,
        "tch": 115.63,
        "tons": 1263,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.061",
        "area": 16.36,
        "tch": 147.45,
        "tons": 2412,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0614",
        "area": 15.89,
        "tch": 153.52,
        "tons": 2439,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0605",
        "area": 4.76,
        "tch": 136.47,
        "tons": 650,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0608",
        "area": 11.75,
        "tch": 149.38,
        "tons": 1755,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0613",
        "area": 13.87,
        "tch": 176.01,
        "tons": 2441,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0611",
        "area": 8.01,
        "tch": 157.82,
        "tons": 1264,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0612",
        "area": 9.23,
        "tch": 158.55,
        "tons": 1463,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0601",
        "area": 17.52,
        "tch": 159.08,
        "tons": 2787,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0602",
        "area": 17.6,
        "tch": 157.78,
        "tons": 2777,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0505",
        "area": 18.46,
        "tch": 123.06,
        "tons": 2272,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0507",
        "area": 27.05,
        "tch": 153.29,
        "tons": 4146,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0501",
        "area": 25.46,
        "tch": 125.15,
        "tons": 3186,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0502",
        "area": 18.56,
        "tch": 169.63,
        "tons": 3148,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0503",
        "area": 8.54,
        "tch": 169.75,
        "tons": 1450,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0504",
        "area": 20.71,
        "tch": 175.27,
        "tons": 3630,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0506",
        "area": 21.33,
        "tch": 155.61,
        "tons": 3319,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0901",
        "area": 14.05,
        "tch": 146.73,
        "tons": 2062,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0902",
        "area": 18.21,
        "tch": 150.49,
        "tons": 2740,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0903",
        "area": 13.71,
        "tch": 193.18,
        "tons": 2649,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0904",
        "area": 11.32,
        "tch": 132.45,
        "tons": 1499,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0905",
        "area": 14.39,
        "tch": 168.79,
        "tons": 2429,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0906",
        "area": 11.58,
        "tch": 168.86,
        "tons": 1955,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0907",
        "area": 6.75,
        "tch": 173.61,
        "tons": 1172,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0908",
        "area": 8.91,
        "tch": 142.65,
        "tons": 1271,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0909",
        "area": 7.25,
        "tch": 132.55,
        "tons": 961,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0703",
        "area": 9.32,
        "tch": 165.33,
        "tons": 1541,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "4.0704",
        "area": 5.9,
        "tch": 110.74,
        "tons": 653,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "4.0706",
        "area": 3.83,
        "tch": 129.72,
        "tons": 497,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "4.0708",
        "area": 7.38,
        "tch": 162.76,
        "tons": 1201,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "4.0709",
        "area": 6.04,
        "tch": 169.52,
        "tons": 1024,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.071",
        "area": 5.36,
        "tch": 126.34,
        "tons": 677,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0711",
        "area": 20.02,
        "tch": 152.53,
        "tons": 3054,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0712",
        "area": 6.03,
        "tch": 194.05,
        "tons": 1170,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0713",
        "area": 13.66,
        "tch": 129.07,
        "tons": 1763,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0716",
        "area": 10.22,
        "tch": 159.43,
        "tons": 1629,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0717",
        "area": 6.25,
        "tch": 150.06,
        "tons": 938,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0719",
        "area": 8.66,
        "tch": 150.52,
        "tons": 1304,
        "variedad": "CP72-2086",
        "tipoCosecha": ""
      },
      {
        "lote": "4.072",
        "area": 11.62,
        "tch": 134.49,
        "tons": 1563,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "4.0701",
        "area": 3.89,
        "tch": 125.04,
        "tons": 486,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0702",
        "area": 8.14,
        "tch": 205.7,
        "tons": 1674,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0705",
        "area": 15.48,
        "tch": 121.8,
        "tons": 1886,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0707",
        "area": 3.9,
        "tch": 127.07,
        "tons": 496,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0714",
        "area": 6.92,
        "tch": 219.61,
        "tons": 1520,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0715",
        "area": 14,
        "tch": 167.11,
        "tons": 2340,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0718",
        "area": 7.17,
        "tch": 211.14,
        "tons": 1514,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0905",
        "area": 17.16,
        "tch": 149.51,
        "tons": 2566,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0906",
        "area": 11.4,
        "tch": 165.91,
        "tons": 1891,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0914",
        "area": 27.42,
        "tch": 151.83,
        "tons": 4163,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0915",
        "area": 7.98,
        "tch": 171.34,
        "tons": 1367,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0916",
        "area": 3.63,
        "tch": 167.08,
        "tons": 607,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1103",
        "area": 4.85,
        "tch": 174.39,
        "tons": 846,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1108",
        "area": 5.37,
        "tch": 138.14,
        "tons": 742,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.111",
        "area": 5.64,
        "tch": 90.5,
        "tons": 510,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0801",
        "area": 4.56,
        "tch": 160.05,
        "tons": 730,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0802",
        "area": 5.44,
        "tch": 153.98,
        "tons": 838,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0803",
        "area": 14.46,
        "tch": 141.29,
        "tons": 2043,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0804",
        "area": 5.19,
        "tch": 159.27,
        "tons": 827,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0805",
        "area": 15.08,
        "tch": 152.43,
        "tons": 2299,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0806",
        "area": 12.67,
        "tch": 154.23,
        "tons": 1954,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0901",
        "area": 9.84,
        "tch": 132.98,
        "tons": 1309,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0903",
        "area": 8.31,
        "tch": 141.63,
        "tons": 1177,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0906",
        "area": 13.08,
        "tch": 143.27,
        "tons": 1874,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0909",
        "area": 15.04,
        "tch": 152.99,
        "tons": 2301,
        "variedad": "CG12-116",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.091",
        "area": 15.19,
        "tch": 141.88,
        "tons": 2155,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0912",
        "area": 1.46,
        "tch": 170.27,
        "tons": 249,
        "variedad": "CG12-116",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0913",
        "area": 10.44,
        "tch": 148.61,
        "tons": 1552,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0915",
        "area": 2.17,
        "tch": 158.71,
        "tons": 344,
        "variedad": "CG12-116",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0916",
        "area": 7.03,
        "tch": 163.48,
        "tons": 1149,
        "variedad": "CG12-116",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0917",
        "area": 4.84,
        "tch": 172.27,
        "tons": 834,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0919",
        "area": 8.73,
        "tch": 138.79,
        "tons": 1212,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0807",
        "area": 7.29,
        "tch": 151.92,
        "tons": 1108,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0808",
        "area": 11.15,
        "tch": 188.94,
        "tons": 2107,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0809",
        "area": 14.09,
        "tch": 144.25,
        "tons": 2033,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.081",
        "area": 5.58,
        "tch": 196.71,
        "tons": 1098,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0811",
        "area": 13.36,
        "tch": 140.25,
        "tons": 1874,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0812",
        "area": 1.5,
        "tch": 106.84,
        "tons": 160,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.1001",
        "area": 24.32,
        "tch": 138.33,
        "tons": 3364,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.1002",
        "area": 24.23,
        "tch": 138.62,
        "tons": 3359,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.1003",
        "area": 23.95,
        "tch": 134.87,
        "tons": 3230,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.1004",
        "area": 23.64,
        "tch": 142.09,
        "tons": 3359,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0701",
        "area": 23.68,
        "tch": 140.46,
        "tons": 3326,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "3.0702",
        "area": 22.22,
        "tch": 119.47,
        "tons": 2655,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "3.0703",
        "area": 24.33,
        "tch": 144.38,
        "tons": 3513,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "3.0704",
        "area": 25.25,
        "tch": 135.05,
        "tons": 3410,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte granel en verde"
      },
      {
        "lote": "3.0801",
        "area": 4.63,
        "tch": 165.62,
        "tons": 767,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0802",
        "area": 4.41,
        "tch": 150.03,
        "tons": 662,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0805",
        "area": 10.9,
        "tch": 127.66,
        "tons": 1391,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0806",
        "area": 8.45,
        "tch": 162.99,
        "tons": 1377,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0809",
        "area": 12.99,
        "tch": 170.63,
        "tons": 2216,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.081",
        "area": 9.56,
        "tch": 140.87,
        "tons": 1347,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0803",
        "area": 10.32,
        "tch": 123.35,
        "tons": 1273,
        "variedad": "CG05-077440",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0807",
        "area": 9.84,
        "tch": 144.29,
        "tons": 1420,
        "variedad": "CG05-077440",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0812",
        "area": 14.53,
        "tch": 169.01,
        "tons": 2456,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0814",
        "area": 6.49,
        "tch": 102.27,
        "tons": 664,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0804",
        "area": 14.74,
        "tch": 158.72,
        "tons": 2339,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0808",
        "area": 7.22,
        "tch": 106.12,
        "tons": 766,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0811",
        "area": 8.89,
        "tch": 124.79,
        "tons": 1109,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0813",
        "area": 11.26,
        "tch": 181.06,
        "tons": 2039,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0815",
        "area": 8.95,
        "tch": 143.06,
        "tons": 1280,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0816",
        "area": 11.37,
        "tch": 128.79,
        "tons": 1464,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0901",
        "area": 10.79,
        "tch": 138.91,
        "tons": 1499,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0902",
        "area": 18.07,
        "tch": 154.67,
        "tons": 2795,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0907",
        "area": 16.7,
        "tch": 145.95,
        "tons": 2437,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.091",
        "area": 4.68,
        "tch": 124.42,
        "tons": 582,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0903",
        "area": 10.79,
        "tch": 178.72,
        "tons": 1928,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0904",
        "area": 9.86,
        "tch": 145.01,
        "tons": 1430,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0909",
        "area": 13.61,
        "tch": 137.27,
        "tons": 1868,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0912",
        "area": 9.3,
        "tch": 126.88,
        "tons": 1180,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0908",
        "area": 18.04,
        "tch": 158.51,
        "tons": 2860,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0911",
        "area": 9.94,
        "tch": 136.19,
        "tons": 1354,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0913",
        "area": 4.73,
        "tch": 164.36,
        "tons": 777,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0401",
        "area": 24.32,
        "tch": 123.82,
        "tons": 3011,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0402",
        "area": 4.15,
        "tch": 137.01,
        "tons": 569,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0403",
        "area": 24.53,
        "tch": 138.71,
        "tons": 3403,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0404",
        "area": 23.86,
        "tch": 151.6,
        "tons": 3617,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0405",
        "area": 22.35,
        "tch": 137.16,
        "tons": 3066,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0406",
        "area": 10.87,
        "tch": 153.53,
        "tons": 1669,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0407",
        "area": 7.32,
        "tch": 138.96,
        "tons": 1017,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0408",
        "area": 6.05,
        "tch": 144.58,
        "tons": 875,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0206",
        "area": 12.39,
        "tch": 147.28,
        "tons": 1825,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0208",
        "area": 9.46,
        "tch": 147.28,
        "tons": 1393,
        "variedad": "VARIAS",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0201",
        "area": 12.09,
        "tch": 125.14,
        "tons": 54,
        "variedad": "Varias",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "3.0202",
        "area": 12.63,
        "tch": 134.17,
        "tons": 1695,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "3.0203",
        "area": 14.48,
        "tch": 143.41,
        "tons": 2077,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0204",
        "area": 12.37,
        "tch": 139.07,
        "tons": 1720,
        "variedad": "VARIAS",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "3.0205",
        "area": 14.45,
        "tch": 115.38,
        "tons": 1667,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "3.0207",
        "area": 12.43,
        "tch": 109.56,
        "tons": 1362,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0101",
        "area": 3.74,
        "tch": 147.51,
        "tons": 552,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0102",
        "area": 10.79,
        "tch": 190.11,
        "tons": 2051,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0104",
        "area": 9.29,
        "tch": 147.24,
        "tons": 1368,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0105",
        "area": 15.53,
        "tch": 175.79,
        "tons": 2730,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0107",
        "area": 11.24,
        "tch": 146.92,
        "tons": 1651,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0108",
        "area": 11.19,
        "tch": 164.06,
        "tons": 1836,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0109",
        "area": 25.92,
        "tch": 161.75,
        "tons": 4193,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.011",
        "area": 11.22,
        "tch": 124.91,
        "tons": 1401,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0111",
        "area": 4.66,
        "tch": 128.84,
        "tons": 600,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0112",
        "area": 1.53,
        "tch": 168.82,
        "tons": 258,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0113",
        "area": 7.33,
        "tch": 153.41,
        "tons": 1125,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0201",
        "area": 17.59,
        "tch": 121.1,
        "tons": 2130,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0202",
        "area": 10.13,
        "tch": 138.67,
        "tons": 1405,
        "variedad": "CG12-116",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0207",
        "area": 21.92,
        "tch": 139.71,
        "tons": 3062,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0208",
        "area": 21.63,
        "tch": 112.31,
        "tons": 2429,
        "variedad": "Varias",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0209",
        "area": 8.53,
        "tch": 137.31,
        "tons": 1171,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.021",
        "area": 9.72,
        "tch": 163.92,
        "tons": 1593,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0301",
        "area": 8.78,
        "tch": 133.68,
        "tons": 1174,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0302",
        "area": 18.23,
        "tch": 139.36,
        "tons": 2540,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0303",
        "area": 10.83,
        "tch": 157.18,
        "tons": 1702,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0304",
        "area": 26.18,
        "tch": 132.15,
        "tons": 3460,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0309",
        "area": 4.76,
        "tch": 111.59,
        "tons": 531,
        "variedad": "Varias",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.031",
        "area": 9.86,
        "tch": 118.5,
        "tons": 1168,
        "variedad": "Varias",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0311",
        "area": 7.59,
        "tch": 124.56,
        "tons": 945,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0312",
        "area": 9.73,
        "tch": 125.46,
        "tons": 1221,
        "variedad": "Varias",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0313",
        "area": 6.02,
        "tch": 149.71,
        "tons": 901,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0403",
        "area": 9.93,
        "tch": 118.43,
        "tons": 1176,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0404",
        "area": 5.48,
        "tch": 145.23,
        "tons": 796,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0405",
        "area": 12.15,
        "tch": 168.2,
        "tons": 2044,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0406",
        "area": 7.57,
        "tch": 130.72,
        "tons": 990,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0407",
        "area": 2.75,
        "tch": 147.26,
        "tons": 405,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0408",
        "area": 14.78,
        "tch": 134.56,
        "tons": 1989,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0409",
        "area": 10.5,
        "tch": 193.28,
        "tons": 2029,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.041",
        "area": 9.98,
        "tch": 159.65,
        "tons": 1593,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0411",
        "area": 8.04,
        "tch": 158.05,
        "tons": 1271,
        "variedad": "CG98-46",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0412",
        "area": 8.25,
        "tch": 162.31,
        "tons": 1339,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0413",
        "area": 9.38,
        "tch": 127.78,
        "tons": 1199,
        "variedad": "CG98-46",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0414",
        "area": 9.21,
        "tch": 134.61,
        "tons": 1240,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0416",
        "area": 11.94,
        "tch": 158.63,
        "tons": 1894,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0415",
        "area": 11.66,
        "tch": 148.83,
        "tons": 1735,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0604",
        "area": 9.41,
        "tch": 143.01,
        "tons": 1346,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0605",
        "area": 6.41,
        "tch": 126.2,
        "tons": 809,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0503",
        "area": 17.59,
        "tch": 149,
        "tons": 2621,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0505",
        "area": 19.91,
        "tch": 139.51,
        "tons": 2778,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0507",
        "area": 16.43,
        "tch": 146.8,
        "tons": 2412,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "4.0509",
        "area": 26.52,
        "tch": 175.08,
        "tons": 4643,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0511",
        "area": 14.3,
        "tch": 146.34,
        "tons": 2093,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0601",
        "area": 24.72,
        "tch": 158.38,
        "tons": 3915,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0604",
        "area": 24.4,
        "tch": 136.67,
        "tons": 3335,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0308",
        "area": 22.8,
        "tch": 146.92,
        "tons": 3350,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0311",
        "area": 10.15,
        "tch": 143,
        "tons": 1451,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "2.0314",
        "area": 12.45,
        "tch": 143,
        "tons": 1780,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0201",
        "area": 22.97,
        "tch": 128.27,
        "tons": 2946,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0202",
        "area": 16.7,
        "tch": 153.4,
        "tons": 2562,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0203",
        "area": 1.96,
        "tch": 132.18,
        "tons": 259,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0204",
        "area": 26.95,
        "tch": 151.49,
        "tons": 4083,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0205",
        "area": 23.86,
        "tch": 154.63,
        "tons": 3690,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0206",
        "area": 2.06,
        "tch": 160.37,
        "tons": 330,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0302",
        "area": 15.85,
        "tch": 137.96,
        "tons": 2187,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0301",
        "area": 30.3,
        "tch": 121.24,
        "tons": 3673,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0305",
        "area": 30.68,
        "tch": 145,
        "tons": 4449,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.0306",
        "area": 12.13,
        "tch": 145,
        "tons": 1759,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0503",
        "area": 14.56,
        "tch": 150,
        "tons": 2184,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0506",
        "area": 13.08,
        "tch": 150,
        "tons": 1962,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0509",
        "area": 11.62,
        "tch": 150,
        "tons": 1743,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0511",
        "area": 9.82,
        "tch": 145.43,
        "tons": 1428,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0512",
        "area": 12.15,
        "tch": 139.96,
        "tons": 1701,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0501",
        "area": 6.92,
        "tch": 150,
        "tons": 1038,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0502",
        "area": 13.06,
        "tch": 150,
        "tons": 1959,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0504",
        "area": 5.24,
        "tch": 150,
        "tons": 786,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0505",
        "area": 17.44,
        "tch": 150,
        "tons": 2616,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0507",
        "area": 6.53,
        "tch": 150,
        "tons": 980,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0508",
        "area": 17.9,
        "tch": 150,
        "tons": 2685,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.051",
        "area": 11.64,
        "tch": 150,
        "tons": 1746,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0801",
        "area": 15.51,
        "tch": 140,
        "tons": 2171,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0804",
        "area": 11.64,
        "tch": 140,
        "tons": 1630,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0807",
        "area": 13.77,
        "tch": 135.35,
        "tons": 1864,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0808",
        "area": 2.05,
        "tch": 140,
        "tons": 287,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0809",
        "area": 13.07,
        "tch": 140,
        "tons": 1830,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.1002",
        "area": 17.88,
        "tch": 145,
        "tons": 2593,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1006",
        "area": 15.09,
        "tch": 138.8,
        "tons": 2094,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1009",
        "area": 8.37,
        "tch": 145,
        "tons": 1214,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1001",
        "area": 7.76,
        "tch": 145,
        "tons": 1125,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1005",
        "area": 9.51,
        "tch": 143.36,
        "tons": 1363,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1012",
        "area": 12.58,
        "tch": 154.92,
        "tons": 1949,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1015",
        "area": 19.54,
        "tch": 178.44,
        "tons": 3487,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1016",
        "area": 6.5,
        "tch": 196.85,
        "tons": 1279,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1017",
        "area": 2.77,
        "tch": 172.14,
        "tons": 477,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0102",
        "area": 14.37,
        "tch": 176.04,
        "tons": 2530,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0105",
        "area": 9.65,
        "tch": 146.91,
        "tons": 1418,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0107",
        "area": 14.75,
        "tch": 188.67,
        "tons": 2783,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0101",
        "area": 22.15,
        "tch": 140,
        "tons": 3101,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0103",
        "area": 23.35,
        "tch": 140,
        "tons": 3269,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0104",
        "area": 21.89,
        "tch": 140,
        "tons": 3065,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "3.0106",
        "area": 28.66,
        "tch": 140,
        "tons": 4012,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0602",
        "area": 10.84,
        "tch": 156.47,
        "tons": 1696,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0603",
        "area": 10.78,
        "tch": 155.56,
        "tons": 1677,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0605",
        "area": 20.13,
        "tch": 155.76,
        "tons": 3135,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0606",
        "area": 21.18,
        "tch": 161.74,
        "tons": 3426,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0315",
        "area": 7.49,
        "tch": 140.72,
        "tons": 1054,
        "variedad": "CG04-10295",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0316",
        "area": 3.78,
        "tch": 148.69,
        "tons": 562,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0609",
        "area": 13.89,
        "tch": 168.43,
        "tons": 2339,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.061",
        "area": 15.22,
        "tch": 163.08,
        "tons": 2482,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0612",
        "area": 16.74,
        "tch": 148.47,
        "tons": 2485,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0613",
        "area": 18.48,
        "tch": 159.47,
        "tons": 2947,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0401",
        "area": 14.82,
        "tch": 173.84,
        "tons": 2576,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0402",
        "area": 19.54,
        "tch": 164.28,
        "tons": 3210,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0403",
        "area": 15.22,
        "tch": 165.68,
        "tons": 2522,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0404",
        "area": 13.49,
        "tch": 177.07,
        "tons": 2389,
        "variedad": "CG12-116",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0405",
        "area": 7.8,
        "tch": 153.08,
        "tons": 1194,
        "variedad": "CG12-116",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0406",
        "area": 9.7,
        "tch": 148.86,
        "tons": 1444,
        "variedad": "CG12-116",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0802",
        "area": 18.56,
        "tch": 149.86,
        "tons": 2781,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0803",
        "area": 6.56,
        "tch": 164.52,
        "tons": 1079,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0805",
        "area": 8.18,
        "tch": 154.8,
        "tons": 1266,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0806",
        "area": 9,
        "tch": 159.1,
        "tons": 1432,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.081",
        "area": 13.89,
        "tch": 175.15,
        "tons": 2433,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0811",
        "area": 17.11,
        "tch": 163.02,
        "tons": 2789,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1101",
        "area": 20.68,
        "tch": 128.76,
        "tons": 2663,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1105",
        "area": 13.05,
        "tch": 124.48,
        "tons": 1624,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1106",
        "area": 35.88,
        "tch": 130.24,
        "tons": 4673,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1102",
        "area": 24.54,
        "tch": 131.04,
        "tons": 3216,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1107",
        "area": 28.33,
        "tch": 133.48,
        "tons": 3781,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0901",
        "area": 19.22,
        "tch": 128.02,
        "tons": 2460,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0902",
        "area": 30,
        "tch": 116.46,
        "tons": 3494,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0903",
        "area": 27.1,
        "tch": 123.07,
        "tons": 3335,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0904",
        "area": 9.32,
        "tch": 144.21,
        "tons": 1344,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.0905",
        "area": 34.4,
        "tch": 139.33,
        "tons": 4793,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.1104",
        "area": 12.38,
        "tch": 143,
        "tons": 1770,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.1109",
        "area": 12.56,
        "tch": 143,
        "tons": 1796,
        "variedad": "CG98-46",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "1.1111",
        "area": 10.57,
        "tch": 143,
        "tons": 1512,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "1.1112",
        "area": 2.91,
        "tch": 143,
        "tons": 416,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "1.1113",
        "area": 7.29,
        "tch": 143,
        "tons": 1042,
        "variedad": "CG04-10295",
        "tipoCosecha": ""
      },
      {
        "lote": "1.1003",
        "area": 3.12,
        "tch": 123.88,
        "tons": 387,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1004",
        "area": 9.7,
        "tch": 135.69,
        "tons": 1316,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1007",
        "area": 16.3,
        "tch": 154.95,
        "tons": 2526,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1008",
        "area": 13.34,
        "tch": 157.2,
        "tons": 2097,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.101",
        "area": 12.23,
        "tch": 172.39,
        "tons": 2108,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1011",
        "area": 14.17,
        "tch": 90.84,
        "tons": 1287,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1013",
        "area": 12.24,
        "tch": 152.47,
        "tons": 1866,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1014",
        "area": 16.08,
        "tch": 129.98,
        "tons": 2090,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1018",
        "area": 7.31,
        "tch": 150.48,
        "tons": 1100,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.1019",
        "area": 6.18,
        "tch": 156.92,
        "tons": 970,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0607",
        "area": 15.46,
        "tch": 132.96,
        "tons": 2056,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0608",
        "area": 19.14,
        "tch": 179.22,
        "tons": 3430,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte granel en verde"
      },
      {
        "lote": "2.0611",
        "area": 16.8,
        "tch": 82.99,
        "tons": 1394,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0104",
        "area": 9.59,
        "tch": 147.88,
        "tons": 1418,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0105",
        "area": 12.04,
        "tch": 138.13,
        "tons": 1663,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0109",
        "area": 13.5,
        "tch": 143.96,
        "tons": 1943,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.011",
        "area": 6.79,
        "tch": 175.25,
        "tons": 1190,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0102",
        "area": 10.42,
        "tch": 165.29,
        "tons": 1722,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0103",
        "area": 15.12,
        "tch": 142.64,
        "tons": 2157,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0107",
        "area": 15.66,
        "tch": 153.16,
        "tons": 2398,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0108",
        "area": 21.63,
        "tch": 143.77,
        "tons": 3110,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0112",
        "area": 12.47,
        "tch": 154.71,
        "tons": 1929,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0101",
        "area": 6.9,
        "tch": 152.73,
        "tons": 1054,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0106",
        "area": 14.89,
        "tch": 164.34,
        "tons": 2447,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0111",
        "area": 7.19,
        "tch": 147.45,
        "tons": 1060,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0301",
        "area": 3.54,
        "tch": 147.28,
        "tons": 521,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0302",
        "area": 3.78,
        "tch": 147.28,
        "tons": 557,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0303",
        "area": 6.28,
        "tch": 147.28,
        "tons": 925,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0304",
        "area": 7.42,
        "tch": 147.28,
        "tons": 1093,
        "variedad": "CP72-2086",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0305",
        "area": 4.81,
        "tch": 143,
        "tons": 688,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "2.0306",
        "area": 12.11,
        "tch": 130.71,
        "tons": 1583,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0307",
        "area": 14.3,
        "tch": 143.78,
        "tons": 2056,
        "variedad": "CGMEX10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0309",
        "area": 4.51,
        "tch": 139.48,
        "tons": 629,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.031",
        "area": 5.42,
        "tch": 207.18,
        "tons": 1123,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0312",
        "area": 7.5,
        "tch": 155.61,
        "tons": 1167,
        "variedad": "CG02-163",
        "tipoCosecha": "Mecanizado"
      },
      {
        "lote": "2.0313",
        "area": 6.18,
        "tch": 171.9,
        "tons": 1062,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.091",
        "area": 6.83,
        "tch": 66.58,
        "tons": 455,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0911",
        "area": 8.9,
        "tch": 127.54,
        "tons": 1135,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0912",
        "area": 7.22,
        "tch": 133.24,
        "tons": 962,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0913",
        "area": 5.71,
        "tch": 118.32,
        "tons": 676,
        "variedad": "CG05-077440",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0914",
        "area": 7.54,
        "tch": 137.59,
        "tons": 1037,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "2.0915",
        "area": 6.29,
        "tch": 180.05,
        "tons": 1133,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "4.0314",
        "area": 2.91,
        "tch": 186.64,
        "tons": 543,
        "variedad": "CG02-163",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "4.0315",
        "area": 13.91,
        "tch": 136.63,
        "tons": 1901,
        "variedad": "CG04-10295",
        "tipoCosecha": "Manual"
      },
      {
        "lote": "1.0101",
        "area": 2.68,
        "tch": 139.65,
        "tons": 374,
        "variedad": "CG05-077440",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0102",
        "area": 12.82,
        "tch": 136.89,
        "tons": 1755,
        "variedad": "CG04-10295",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0103",
        "area": 8.47,
        "tch": 148.25,
        "tons": 1256,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0104",
        "area": 23.42,
        "tch": 126.3,
        "tons": 2958,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0105",
        "area": 9.64,
        "tch": 134.27,
        "tons": 1294,
        "variedad": "CG05-077440",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0106",
        "area": 25.03,
        "tch": 111.88,
        "tons": 2800,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "1.0107",
        "area": 28.66,
        "tch": 147.23,
        "tons": 4220,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "SAN CARLOS I",
    "code": "33",
    "lotes": [
      {
        "lote": "33.03",
        "area": 78.13,
        "tch": 111.5,
        "tons": 8712,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "33.01",
        "area": 71.92,
        "tch": 115.48,
        "tons": 8305,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "33.02",
        "area": 75.25,
        "tch": 137.64,
        "tons": 10358,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "SAN ESTEBAN",
    "code": "54",
    "lotes": [
      {
        "lote": "54.01",
        "area": 22.73,
        "tch": 99.14,
        "tons": 2228,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "SAN FRANCISCO  MAPAN",
    "code": "52",
    "lotes": [
      {
        "lote": "52.03",
        "area": 43.42,
        "tch": 121.69,
        "tons": 5284,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "52.06",
        "area": 22.24,
        "tch": 97.78,
        "tons": 2175,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "52.02",
        "area": 30.32,
        "tch": 90.9,
        "tons": 2756,
        "variedad": "RB845210",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "52.01",
        "area": 38.96,
        "tch": 79.61,
        "tons": 3102,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "52.04",
        "area": 14.78,
        "tch": 95.72,
        "tons": 1415,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "52.05",
        "area": 46.72,
        "tch": 86.12,
        "tons": 4023,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "SAN FRANCISCO LU",
    "code": "6",
    "lotes": [
      {
        "lote": "6.01",
        "area": 21.36,
        "tch": 129.83,
        "tons": 2773,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "6.02",
        "area": 17.1,
        "tch": 129.49,
        "tons": 2214,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "6.03",
        "area": 145.69,
        "tch": 102.27,
        "tons": 14900,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "6.06",
        "area": 43.54,
        "tch": 78.14,
        "tons": 3402,
        "variedad": "CG12-116",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "6.04",
        "area": 115.9,
        "tch": 134.52,
        "tons": 15591,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "6.05",
        "area": 99.61,
        "tch": 112.05,
        "tons": 11162,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "SAN JOSE BUENA VISTA",
    "code": "630",
    "lotes": [
      {
        "lote": "1.18",
        "area": 2.66,
        "tch": 74.14,
        "tons": 197,
        "variedad": "CP73-1547",
        "tipoCosecha": ""
      },
      {
        "lote": "2.01",
        "area": 8.09,
        "tch": 45.6,
        "tons": 369,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.01",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "2.07",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.06",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.08",
        "area": 10.94,
        "tch": 37.45,
        "tons": 410,
        "variedad": "CP73-1547",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "3.03",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "2.1",
        "area": 11.82,
        "tch": 50.93,
        "tons": 602,
        "variedad": "CP73-1547",
        "tipoCosecha": ""
      },
      {
        "lote": "3.05",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "3.06",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      },
      {
        "lote": "3.02",
        "area": 10.54,
        "tch": 23.06,
        "tons": 243,
        "variedad": "CP72-2086",
        "tipoCosecha": ""
      },
      {
        "lote": "3.04",
        "area": 5.05,
        "tch": 23.08,
        "tons": 117,
        "variedad": "CP72-2086",
        "tipoCosecha": ""
      },
      {
        "lote": "2.04",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": "Corte granel quemado minimaleta"
      }
    ]
  },
  {
    "name": "SAN LUIS",
    "code": "34",
    "lotes": [
      {
        "lote": "34.01 A",
        "area": 51.02,
        "tch": 115.02,
        "tons": 5868,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.01 B",
        "area": 51.02,
        "tch": 115.02,
        "tons": 5868,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.19",
        "area": 49.25,
        "tch": 129.24,
        "tons": 6365,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "34.05",
        "area": 53.51,
        "tch": 144.61,
        "tons": 7738,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.06 A",
        "area": 138.99,
        "tch": 122.46,
        "tons": 17021,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.06 B",
        "area": 138.99,
        "tch": 122.46,
        "tons": 17021,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.02 B",
        "area": 74.14,
        "tch": 121.55,
        "tons": 9012,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.02 A",
        "area": 74.14,
        "tch": 121.55,
        "tons": 9012,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.03 A",
        "area": 59.22,
        "tch": 117.25,
        "tons": 6943,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "34.03 B",
        "area": 59.22,
        "tch": 117.25,
        "tons": 6943,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "34.03 C",
        "area": 59.22,
        "tch": 117.25,
        "tons": 6943,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "34.08",
        "area": 87.11,
        "tch": 125.61,
        "tons": 10942,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.13",
        "area": 28.9,
        "tch": 124.95,
        "tons": 3611,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.04",
        "area": 39.6,
        "tch": 120.05,
        "tons": 4754,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.09",
        "area": 94.1,
        "tch": 125.56,
        "tons": 11815,
        "variedad": "CG00-102",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.07",
        "area": 77.42,
        "tch": 142.23,
        "tons": 11011,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.14",
        "area": 31.94,
        "tch": 113.84,
        "tons": 3636,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.16",
        "area": 30.45,
        "tch": 127.79,
        "tons": 3891,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "34.18",
        "area": 8.77,
        "tch": 71.52,
        "tons": 627,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "34.12",
        "area": 30.68,
        "tch": 123.64,
        "tons": 3793,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "34.11",
        "area": 58.3,
        "tch": 94.84,
        "tons": 5529,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "34.15",
        "area": 85.4,
        "tch": 106.77,
        "tons": 9119,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "34.17",
        "area": 19.52,
        "tch": 100,
        "tons": 1952,
        "variedad": "",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "SAN MARCOS",
    "code": "559",
    "lotes": [
      {
        "lote": "1.103",
        "area": 10.35,
        "tch": 121.36,
        "tons": 1256,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.104",
        "area": 6.54,
        "tch": 104.99,
        "tons": 687,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.209",
        "area": 6.98,
        "tch": 126.4,
        "tons": 882,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.21",
        "area": 4.42,
        "tch": 131.07,
        "tons": 579,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.312",
        "area": 3.44,
        "tch": 100.62,
        "tons": 346,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.313",
        "area": 2.83,
        "tch": 102.42,
        "tons": 290,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.314",
        "area": 4.84,
        "tch": 155.83,
        "tons": 754,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.315",
        "area": 3.07,
        "tch": 231.63,
        "tons": 711,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.316",
        "area": 3.99,
        "tch": 117.49,
        "tons": 469,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.317",
        "area": 4.56,
        "tch": 100.29,
        "tons": 457,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.208",
        "area": 2.23,
        "tch": 130.09,
        "tons": 290,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.419",
        "area": 3.16,
        "tch": 98.86,
        "tons": 312,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.52",
        "area": 4.08,
        "tch": 105.52,
        "tons": 431,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.521",
        "area": 4.4,
        "tch": 110.36,
        "tons": 486,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.522",
        "area": 4.26,
        "tch": 114.14,
        "tons": 486,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.523",
        "area": 4.1,
        "tch": 173.66,
        "tons": 712,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.524",
        "area": 4.02,
        "tch": 133.32,
        "tons": 536,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.525",
        "area": 2.18,
        "tch": 103.16,
        "tons": 225,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.626",
        "area": 3.65,
        "tch": 124.73,
        "tons": 455,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.627",
        "area": 3.07,
        "tch": 94.09,
        "tons": 289,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.628",
        "area": 2.97,
        "tch": 99.25,
        "tons": 295,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.731",
        "area": 4.55,
        "tch": 81.74,
        "tons": 372,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.732",
        "area": 1.99,
        "tch": 108.96,
        "tons": 217,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.733",
        "area": 3.84,
        "tch": 119.81,
        "tons": 460,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.734",
        "area": 1.57,
        "tch": 95.96,
        "tons": 151,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.735",
        "area": 4.61,
        "tch": 105.91,
        "tons": 488,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.736",
        "area": 3.49,
        "tch": 117.3,
        "tons": 409,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.737",
        "area": 1.29,
        "tch": 110.76,
        "tons": 143,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.838",
        "area": 2.85,
        "tch": 127.83,
        "tons": 364,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.839",
        "area": 4.41,
        "tch": 146.57,
        "tons": 646,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.84",
        "area": 1.99,
        "tch": 116.98,
        "tons": 233,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.143",
        "area": 6.64,
        "tch": 108.38,
        "tons": 720,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.253",
        "area": 0.35,
        "tch": 158.07,
        "tons": 55,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.254",
        "area": 2.29,
        "tch": 110.61,
        "tons": 253,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.255",
        "area": 0.8,
        "tch": 104.16,
        "tons": 83,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.256",
        "area": 1.05,
        "tch": 136.45,
        "tons": 143,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.257",
        "area": 6.72,
        "tch": 103.96,
        "tons": 699,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.101",
        "area": 0.24,
        "tch": 173.23,
        "tons": 42,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.102",
        "area": 0.49,
        "tch": 84.85,
        "tons": 42,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.105",
        "area": 9.24,
        "tch": 91.31,
        "tons": 844,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.841",
        "area": 5.98,
        "tch": 136.33,
        "tons": 815,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.842",
        "area": 2.6,
        "tch": 97.4,
        "tons": 253,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.258",
        "area": 3.72,
        "tch": 137.3,
        "tons": 511,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.63",
        "area": 1.86,
        "tch": 100.01,
        "tons": 186,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.629",
        "area": 3.32,
        "tch": 100.3,
        "tons": 333,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.418",
        "area": 11.22,
        "tch": 121.36,
        "tons": 1362,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.106",
        "area": 3.89,
        "tch": 133.83,
        "tons": 521,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "1.311",
        "area": 1.5,
        "tch": 195.83,
        "tons": 294,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.144",
        "area": 1.14,
        "tch": 128.32,
        "tons": 146,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.145",
        "area": 3.94,
        "tch": 94.18,
        "tons": 371,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.146",
        "area": 1.42,
        "tch": 129.78,
        "tons": 184,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.147",
        "area": 1.88,
        "tch": 115.22,
        "tons": 217,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.148",
        "area": 2.2,
        "tch": 107.98,
        "tons": 238,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.249",
        "area": 0.87,
        "tch": 115.93,
        "tons": 101,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.25",
        "area": 1.71,
        "tch": 96.66,
        "tons": 165,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.251",
        "area": 2.83,
        "tch": 83.2,
        "tons": 235,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "2.252",
        "area": 1.06,
        "tch": 109.47,
        "tons": 116,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "SAN MIGUEL MAPAN",
    "code": "68",
    "lotes": [
      {
        "lote": "68.09",
        "area": 25.64,
        "tch": 89.46,
        "tons": 2294,
        "variedad": "RB845210",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "68.05",
        "area": 43.67,
        "tch": 95.39,
        "tons": 4166,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "68.03",
        "area": 70.29,
        "tch": 89.42,
        "tons": 6286,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "68.04",
        "area": 17.51,
        "tch": 100.12,
        "tons": 1753,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "68.01",
        "area": 100.88,
        "tch": 127.29,
        "tons": 12841,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "68.1",
        "area": 55.83,
        "tch": 103.11,
        "tons": 5756,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "68.06",
        "area": 22.06,
        "tch": 79.78,
        "tons": 1760,
        "variedad": "RB845210",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "68.02",
        "area": 39.63,
        "tch": 99.62,
        "tons": 3948,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "68.08",
        "area": 74.5,
        "tch": 103.26,
        "tons": 7693,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "68.07",
        "area": 38.18,
        "tch": 122.26,
        "tons": 4668,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "68.11",
        "area": 6.25,
        "tch": 71.45,
        "tons": 199,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "68.12",
        "area": 10.31,
        "tch": 56.38,
        "tons": 275,
        "variedad": "Varias",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "68.13",
        "area": 10.6,
        "tch": 80.19,
        "tons": 850,
        "variedad": "Varias",
        "tipoCosecha": ""
      },
      {
        "lote": "68.14",
        "area": 12.54,
        "tch": 54.14,
        "tons": 679,
        "variedad": "Varias",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "SAN NICOLAS DE MALAGA",
    "code": "59",
    "lotes": [
      {
        "lote": "59.01",
        "area": 110.51,
        "tch": 109.59,
        "tons": 12101,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "59.02",
        "area": 38.73,
        "tch": 120.87,
        "tons": 4586,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "59.03",
        "area": 58.46,
        "tch": 133.94,
        "tons": 7830,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "59.05",
        "area": 42.94,
        "tch": 122.96,
        "tons": 5280,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "59.06",
        "area": 30.19,
        "tch": 101.37,
        "tons": 3060,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "59.04",
        "area": 34.99,
        "tch": 87.6,
        "tons": 3065,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "59.07",
        "area": 0,
        "tch": 100,
        "tons": 0,
        "variedad": "",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "SANTA CLARA LAS ARENAS",
    "code": "40",
    "lotes": [
      {
        "lote": "40.01",
        "area": 104.71,
        "tch": 98.5,
        "tons": 10193,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "40.02",
        "area": 90.12,
        "tch": 93.65,
        "tons": 8405,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "SANTA ELENA MAPAN",
    "code": "51",
    "lotes": [
      {
        "lote": "51.03",
        "area": 42.07,
        "tch": 120.37,
        "tons": 5064,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "51.02",
        "area": 21.96,
        "tch": 87.85,
        "tons": 1929,
        "variedad": "CG12-116",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "51.01",
        "area": 44.81,
        "tch": 78.99,
        "tons": 3540,
        "variedad": "CG04-10267",
        "tipoCosecha": "Corte Granel Quemado"
      }
    ]
  },
  {
    "name": "SANTA ELENA TIKAL",
    "code": "74",
    "lotes": [
      {
        "lote": "74.05",
        "area": 154.42,
        "tch": 123.33,
        "tons": 19044,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "74.03",
        "area": 32.43,
        "tch": 131.95,
        "tons": 4279,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "74.07",
        "area": 72.98,
        "tch": 132.46,
        "tons": 9667,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "74.08",
        "area": 65.31,
        "tch": 144.73,
        "tons": 3918,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "74.06",
        "area": 59.93,
        "tch": 134.32,
        "tons": 8050,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "74.11",
        "area": 8.56,
        "tch": 133.07,
        "tons": 1139,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "74.12",
        "area": 6.85,
        "tch": 134.01,
        "tons": 918,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "74.13",
        "area": 7.85,
        "tch": 130.87,
        "tons": 1027,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "74.01",
        "area": 64.91,
        "tch": 128.16,
        "tons": 8310,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "74.02",
        "area": 22.64,
        "tch": 100.02,
        "tons": 2264,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "74.04",
        "area": 63.78,
        "tch": 135.24,
        "tons": 7611,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "74.09",
        "area": 25.21,
        "tch": 99.47,
        "tons": 2508,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      },
      {
        "lote": "74.1",
        "area": 28.47,
        "tch": 131.1,
        "tons": 3733,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte y alce mecanizado en verde"
      }
    ]
  },
  {
    "name": "SANTA RICARDA",
    "code": "26",
    "lotes": [
      {
        "lote": "26.04",
        "area": 98.74,
        "tch": 132.19,
        "tons": 13053,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "26.03",
        "area": 111.67,
        "tch": 140.26,
        "tons": 15663,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "26.02",
        "area": 91.84,
        "tch": 120.67,
        "tons": 11082,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "26.01",
        "area": 88.91,
        "tch": 118.11,
        "tons": 10502,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  },
  {
    "name": "SOLOLA",
    "code": "25",
    "lotes": [
      {
        "lote": "25.01",
        "area": 17.74,
        "tch": 66.08,
        "tons": 1172,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "25.03",
        "area": 28.94,
        "tch": 86.74,
        "tons": 2467,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "25.02",
        "area": 125.5,
        "tch": 100.63,
        "tons": 12599,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "25.04",
        "area": 99.99,
        "tch": 85.23,
        "tons": 8522,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "25.05",
        "area": 12.9,
        "tch": 61.96,
        "tons": 229,
        "variedad": "Varias",
        "tipoCosecha": "Corte granel en verde"
      }
    ]
  },
  {
    "name": "TEHUANTEPEC",
    "code": "5",
    "lotes": [
      {
        "lote": "5.14",
        "area": 85.89,
        "tch": 160.59,
        "tons": 13790,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.12",
        "area": 45.74,
        "tch": 166.19,
        "tons": 7590,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.06",
        "area": 80.2,
        "tch": 125.6,
        "tons": 10023,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.05",
        "area": 75.41,
        "tch": 156.18,
        "tons": 11777,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.04",
        "area": 97.74,
        "tch": 141.62,
        "tons": 13141,
        "variedad": "CG98-78",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.11",
        "area": 126.67,
        "tch": 140.31,
        "tons": 17725,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.22",
        "area": 9.69,
        "tch": 103.2,
        "tons": 1000,
        "variedad": "Varias",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.23",
        "area": 13.07,
        "tch": 107.92,
        "tons": 547,
        "variedad": "Varias",
        "tipoCosecha": ""
      },
      {
        "lote": "5.07",
        "area": 124.96,
        "tch": 169.18,
        "tons": 21141,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.03",
        "area": 87.36,
        "tch": 126.06,
        "tons": 11012,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.02",
        "area": 32.01,
        "tch": 109.01,
        "tons": 3489,
        "variedad": "CG98-78",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.17",
        "area": 84,
        "tch": 129.16,
        "tons": 10849,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.19",
        "area": 52.9,
        "tch": 127.78,
        "tons": 6759,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.16",
        "area": 72.76,
        "tch": 130.44,
        "tons": 9490,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.18",
        "area": 33.47,
        "tch": 132.69,
        "tons": 4441,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.21",
        "area": 18.44,
        "tch": 110.24,
        "tons": 2033,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.13",
        "area": 104.93,
        "tch": 122.15,
        "tons": 12745,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.1",
        "area": 43.71,
        "tch": 103.97,
        "tons": 4534,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.09",
        "area": 50.96,
        "tch": 116.35,
        "tons": 5929,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.08",
        "area": 117.6,
        "tch": 127.95,
        "tons": 15002,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.01",
        "area": 85.43,
        "tch": 114.56,
        "tons": 9787,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "5.15",
        "area": 20.6,
        "tch": 137.29,
        "tons": 890,
        "variedad": "Varias",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "TEXCUACO DEPROINGUA",
    "code": "623",
    "lotes": [
      {
        "lote": "1.07",
        "area": 22.04,
        "tch": 152.77,
        "tons": 3367,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.06",
        "area": 14.66,
        "tch": 88.65,
        "tons": 1300,
        "variedad": "SP79-1287",
        "tipoCosecha": ""
      },
      {
        "lote": "1.05",
        "area": 2.55,
        "tch": 90.36,
        "tons": 230,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.04",
        "area": 10.84,
        "tch": 52.13,
        "tons": 565,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.03",
        "area": 20.83,
        "tch": 91.2,
        "tons": 1900,
        "variedad": "SP79-1287",
        "tipoCosecha": ""
      },
      {
        "lote": "1.02",
        "area": 35.36,
        "tch": 81.14,
        "tons": 2869,
        "variedad": "SP71-6161",
        "tipoCosecha": ""
      },
      {
        "lote": "1.01",
        "area": 21.77,
        "tch": 86.66,
        "tons": 1887,
        "variedad": "SP79-1287",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "TOTONICAPAN INAFEB",
    "code": "535",
    "lotes": [
      {
        "lote": "1.01",
        "area": 64.66,
        "tch": 110,
        "tons": 7113,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.02",
        "area": 102.47,
        "tch": 124.85,
        "tons": 12793,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      },
      {
        "lote": "1.03",
        "area": 54.9,
        "tch": 110,
        "tons": 6039,
        "variedad": "CG02-163",
        "tipoCosecha": ""
      }
    ]
  },
  {
    "name": "VENECIA GONZÁLEZ",
    "code": "78",
    "lotes": [
      {
        "lote": "78.01",
        "area": 19.36,
        "tch": 44.08,
        "tons": 853,
        "variedad": "CP72-2086",
        "tipoCosecha": "Corte Granel Quemado"
      },
      {
        "lote": "78.02",
        "area": 15.61,
        "tch": 143.88,
        "tons": 2246,
        "variedad": "CG10-044124",
        "tipoCosecha": "Corte granel en verde"
      }
    ]
  },
  {
    "name": "VIRGINIA",
    "code": "29",
    "lotes": [
      {
        "lote": "29.03",
        "area": 135.84,
        "tch": 124.26,
        "tons": 16879,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "29.04",
        "area": 9.82,
        "tch": 66.1,
        "tons": 646,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "29.02",
        "area": 92.56,
        "tch": 129.18,
        "tons": 11957,
        "variedad": "CG02-163",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      },
      {
        "lote": "29.01",
        "area": 57.27,
        "tch": 104.69,
        "tons": 5996,
        "variedad": "CGMex10-26315",
        "tipoCosecha": "Corte y alce mecanizado en quemado"
      }
    ]
  }
];
