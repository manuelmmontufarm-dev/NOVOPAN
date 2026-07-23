# Tags que consume el simulador

> Archivo **generado**. No editar a mano — correr `node scripts/gen-tags.mjs`
> desde `simulador-final/`. Sale de `TAG_MAP` + `WINCC_ALIAS` + los CSV desplegados.

**104 parámetros** · 16 con tag real de WinCC ya cableado.

| Origen del dato | Cantidad | Qué significa |
|---|---|---|
| HMI · dato vivo | 44 | debería llegar del PLC vía CSV |
| medido en planta | 27 | cinta métrica / plano — constante |
| estimado | 33 | supuesto del modelo, pendiente de confirmar |

## Archivos CSV que se leen

En este orden; **el último gana** y toda colisión queda avisada en el pill de estado.

| # | Archivo | Servidor |
|---|---|---|
| 1 | `datos/hmi.csv` | base |
| 2 | `datos/hmi-preparacion.csv` | Preparación |
| 3 | `datos/hmi-encolado.csv` | Encolado |
| 4 | `datos/hmi-formacion.csv` | Formación |
| 5 | `datos/hmi-sistemas.csv` | Sistemas |

## Dato vivo del HMI — 44

| Tag del CSV | Unidad | Tag real de WinCC | Servidor | Clave(s) del modelo |
|---|---|---|---|---|
| `V_PRENSA_M_MIN` | m/min | `H_PressSpeed_PV` | Formación | `v_prensa` |
| `PESO_MANTA_KGM2` | kg/m² | `H_Act_MatWeight_SP` | Formación | `_global:peso_manta` |
| `F_SL_KGMIN` | kg/min | `F_SL_FlakeFlow_PV` | Encolado | `_global:F_SL` |
| `F_CL_KGMIN` | kg/min | `H_CL_Total_Flakes` | Formación | `_global:F_CL` |
| `PCT_SL1` | % | `H_Act_SL1_SP` | Formación | `_global:pctSL1` |
| `PCT_SL2` | % | — | — | `_global:pctSL2` |
| `PILA1_ASERRIN_M_KG` | kg | — | — | `p1:pila1_M` |
| `PILA1_ASERRIN_F_KGH` | kg/h | — | — | `p1:pila1_F` |
| `PILA2_CHIP_M_KG` | kg | — | — | `p1:pila2_M` |
| `PILA2_CHIP_F_KGH` | kg/h | — | — | `p1:pila2_F` |
| `SILO1_RHO_KGM3` | kg/m³ | — | — | `p1:s1_rho` |
| `SILO1_L_PCT` | % | — | — | `p1:s1_L` |
| `SILO1_FOUT_KGH` | kg/h | — | — | `p1:s1_F` |
| `SILO2A_RHO_KGM3` | kg/m³ | — | — | `p1:s2_rho` |
| `SILO2A_L_PCT` | % | — | — | `p1:s2_L` |
| `SILO2A_FOUT_KGH` | kg/h | — | — | `p1:s2_F` |
| `SILO2B_RHO_KGM3` | kg/m³ | — | — | `p1:s2b_rho` |
| `SILO2B_L_PCT` | % | — | — | `p1:s2b_L` |
| `SILO2B_FOUT_KGH` | kg/h | — | — | `p1:s2b_F` |
| `SILO3_RHO_KGM3` | kg/m³ | — | — | `p1:s3_rho` |
| `SILO3_L_PCT` | % | — | — | `p1:s3_L` |
| `SILO3_FOUT_KGH` | kg/h | — | — | `p1:s3_F` |
| `BUNKER_RHO_KGM3` | kg/m³ | — | — | `p1:bk_rho` |
| `BUNKER_L_PCT` | % | — | — | `p1:bk_L` |
| `BUNKER_FHUM_KGH` | kg/h | — | — | `p1:bk_F` |
| `SILO5_RHO_KGM3` | kg/m³ | `F_CL_FlakeDens_PV` | Encolado | `p1:s5_rho` |
| `SILO5_L_PCT` | % | `066_C_Dry_Material_CL_Level` | Preparación | `p1:s5_L` |
| `SILO5_FOUT_KGMIN` | kg/min | `066_C_Dry_Material_CL_discharge (×0.0167)` | — | `p1:s5_Fmin`<br>`p1:dosG_F`<br>`flow:dosing-thick` |
| `SILO6_RHO_KGM3` | kg/m³ | `F_SL_FlakeDens_PV` | Encolado | `p1:s6_rho` |
| `SILO6_L_PCT` | % | `066_C_Dry_Material_SL_Level` | Preparación | `p1:s6_L` |
| `SILO6_FOUT_KGMIN` | kg/min | `066_C_Dry_Material_SL_discharge (×0.0167)` | — | `p1:s6_Fmin`<br>`p1:dosF_F`<br>`flow:dosing-fine` |
| `SILO4_RHO_KGM3` | kg/m³ | — | — | `p1:s4_rho` |
| `SILO4_L_PCT` | % | — | — | `p1:s4_L` |
| `SILO4_FOUT_KGMIN` | kg/min | — | — | `p1:s4_Fmin` |
| `SILO8_RHO_KGM3` | kg/m³ | — | — | `p1:s8_rho` |
| `SILO8_L_PCT` | % | — | — | `p1:s8_L` |
| `SILO8_FOUT_KGMIN` | kg/min | — | — | `p1:s8_Fmin` |
| `DOSING_CL_M_KG` | kg | `F_CL_DosBin_Weight`<br>`F_CL_DosBin_Weight_PV` | Encolado | `p1:dosG_M`<br>`mass:dosing-thick` |
| `DOSING_CL_F_KGMIN` | kg/min | — | — | `p1:dosG_F`<br>`flow:dosing-thick` |
| `DOSING_SL_M_KG` | kg | `F_SL_DosBin_Weight`<br>`F_SL_DosBin_Weight_PV` | Encolado | `p1:dosF_M`<br>`mass:dosing-fine` |
| `DOSING_SL_F_KGMIN` | kg/min | — | — | `p1:dosF_F`<br>`flow:dosing-fine` |
| `M_ESP1_KG` | kg | `H_SL1_Scale_PV`<br>`SL1_KGM` | Formación | `mass:esp1-zone` |
| `M_ESP2_KG` | kg | `H_CC_Scale_PV`<br>`CC_KGM` | Formación | `mass:esp2-zone` |
| `M_ESP3_KG` | kg | `H_SL2_Scale_PV`<br>`SL2_KGM` | Formación | `mass:esp3-zone` |

## Medido en planta (constante) — 27

| Tag del CSV | Unidad | Tag real de WinCC | Servidor | Clave(s) del modelo |
|---|---|---|---|---|
| `SILO5_V_M3` | m³ | — | — | `p1:s5_V` |
| `SILO6_V_M3` | m³ | — | — | `p1:s6_V` |
| `INCL_CL_L_M` | m | — | — | `p1:inclG_L`<br>`len:incl-thick` |
| `INCL_CL_V_MMIN` | m/min | — | — | `p1:inclG_v`<br>`speed:incl-thick` |
| `INCL_SL_L_M` | m | — | — | `p1:inclF_L`<br>`len:incl-fine` |
| `INCL_SL_V_MMIN` | m/min | — | — | `p1:inclF_v`<br>`speed:incl-fine` |
| `L_BANDA_BLANCA_M` | m | — | — | `len:white` |
| `L_BANDA_ROJA_M` | m | — | — | `len:red` |
| `L_PRENSA_M` | m | — | — | `len:press` |
| `L_POSTPRENSA_M` | m | — | — | `p1:postPress_L` |
| `OFFSET_SENSOR2_M` | m | — | — | `geom:sensor2Offset` |
| `OFFSET_SENSOR3_M` | m | — | — | `geom:sensor3Offset` |
| `M_ESP1_CAIDA_M` | m | — | — | `geom:esp1` |
| `M_ESP2_CAIDA_M` | m | — | — | `geom:esp2` |
| `M_ESP3_CAIDA_M` | m | — | — | `geom:esp3` |
| `M_IMAN_M` | m | — | — | `geom:magnet` |
| `M_SPRAYS2_M` | m | — | — | `geom:sprays2` |
| `M_DETECTOR_M` | m | — | — | `geom:detector` |
| `M_CORTADORES_M` | m | — | — | `geom:cutters` |
| `M_NARIZ_M` | m | — | — | `geom:nose` |
| `M_VAPOR_M` | m | — | — | `geom:vapor` |
| `M_PREPRENSA_M` | m | — | — | `geom:prepress` |
| `M_PREPRENSA_LEN_M` | m | — | — | `geom:prepressLen` |
| `M_REFILA_INICIO_M` | m | — | — | `geom:refilaStart` |
| `M_REFILA_FIN_M` | m | — | — | `geom:refilaEnd` |
| `M_SIERRA_INICIO_M` | m | — | — | `geom:sawStart` |
| `M_SIERRA_FIN_M` | m | — | — | `geom:sawEnd` |

## Estimado (pendiente de confirmar) — 33

| Tag del CSV | Unidad | Tag real de WinCC | Servidor | Clave(s) del modelo |
|---|---|---|---|---|
| `T_DYNESCREEN_S` | s | — | — | `p1:tDS` |
| `T_TRANSP_ASERRIN_S` | s | — | — | `p1:tr1` |
| `T_ESPERA_DESVIADOR_S` | s | — | — | `p1:esperaDesv` |
| `T_TRANSP_FLAKES_S` | s | — | — | `p1:tr2` |
| `T_HOMBAK_S3_S` | s | — | — | `p1:tr3` |
| `SILO1_V_M3` | m³ | — | — | `p1:s1_V` |
| `SILO2A_V_M3` | m³ | — | — | `p1:s2_V` |
| `SILO2B_V_M3` | m³ | — | — | `p1:s2b_V` |
| `SILO3_V_M3` | m³ | — | — | `p1:s3_V` |
| `BUNKER_V_M3` | m³ | — | — | `p1:bk_V` |
| `T_TRANSP_SECADERO_S` | s | — | — | `p1:trSec` |
| `TAU_TAMBOR_S` | s | — | — | `p1:tauTambor` |
| `T_TAMICES_FG_S` | s | — | — | `p1:tCriba` |
| `T_ZARANDAS_S` | s | — | — | `p1:tZar` |
| `T_COLECT_CL_S` | s | — | — | `p1:tColectCL` |
| `T_COLECT_SL_S` | s | — | — | `p1:tColectSL` |
| `T_COLECT_PG_S` | s | — | — | `p1:tColectOver` |
| `T_COLECT_POLVO_S` | s | — | — | `p1:tPolvo` |
| `T_WS1_S` | s | — | — | `p1:tWS1` |
| `T_WS2_S` | s | — | — | `p1:tWS2` |
| `T_WS3_S` | s | — | — | `p1:tWS3` |
| `T_IMAN_FE_S` | s | — | — | `p1:tFe` |
| `T_NEUMATICO_SL_S` | s | — | — | `p1:tNeum` |
| `T_REF1_S` | s | — | — | `p1:tRef1` |
| `T_REF2_S` | s | — | — | `p1:tRef2` |
| `T_CICLON_S` | s | — | — | `p1:tCiclon` |
| `T_CLAS_SL_S` | s | — | — | `p1:tClasSL` |
| `T_REINGRESO_SL_S` | s | — | — | `p1:tReingresoSL` |
| `SILO4_V_M3` | m³ | — | — | `p1:s4_V` |
| `SILO8_V_M3` | m³ | — | — | `p1:s8_V` |
| `T_ENC_CI_S` | s | — | — | `p1:tEncCI`<br>`ret:enc-thick` |
| `T_ENC_CE_S` | s | — | — | `p1:tEncCE`<br>`ret:enc-fine` |
| `T_SPRAYS_CAIDA_S` | s | — | — | `ret:sprays-caida` |
