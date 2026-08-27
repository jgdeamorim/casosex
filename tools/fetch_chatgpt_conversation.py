#!/usr/bin/env python3
"""
Fetch direct backend API for ChatGPT conversation 6a8f985b-040c-83e9-ad00-d8073c66c58c
"""

import json
import os
import requests

CONVO_ID = "6a8f985b-040c-83e9-ad00-d8073c66c58c"
TARGET_URL = f"https://chatgpt.com/backend-api/conversation/{CONVO_ID}"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "spec", "chatgpt_ingest")
os.makedirs(OUTPUT_DIR, exist_ok=True)

cookies = {
    "oai-did": "128c2a4c-cce2-4e02-9b33-bdd007b8aa7d",
    "g_state": '{"i_l":0,"i_ll":1777593391272,"i_e":{"enable_itp_optimization":20},"i_et":1777593391269}',
    "oai-hlib": "true",
    "oai_consent_analytics": "false",
    "oai_consent_marketing": "false",
    "oai_consent_personalization": "false",
    "oai-allow-ne": "false",
    "__stripe_mid": "1fda1ec1-99ee-4bba-be08-176c0e8346c053de91",
    "conv_key_6a8e4be8-ed8c-83e9-8d58-ca816ddbb200": '"NEs3-BB5YfU4xDfoPOd8TRBVx_8G1_gRZdwjmuuhb0o="',
    "__Secure-oai-is": "ois1.eyJ2IjoxLCJhbGciOiJBMjU2R0NNIiwia2lkIjoiY2hhdGdwdC13ZWItdjEifQ.dIFRSspu3SJotlVB.td38uia7OmpkX14EtByyj2Ep9Kol4pTWLhgb_CUZ9FmMd9tsOhWUVQDXFH7spxzp0YpZ7HFT5TayCOeFjf2G4SznB43m1d2vaYvXaY8XXZoLdkejj7pVMySH_N_blRa2Z4HKPQKy8dFChjHhqSUF-cIuM_04MGj54mXO9EprLRaTKuuy5H9WhijCpriYX1eieuZQ-APE9g9WQoex0h-doeUdIaXbEN7y7-3y7H05aQeYXaK0vaDyNnNVu6tW16lnZMTE6Lq0imT64_lCF7Ns3rcekFrRGQ6lv0gzQFzWjOXH9yaqvXzPyvQfYGHWu_GVEppD3Vfs8ErZf4Qebh3_GXMvK9PahJbFncKdhj_yfAQmTKi43hEBJOT5IkS7XSMXu8WxqN2D1nq39EuLY1zwWlPLK8Dez8FCycnnlh3D92je0ko74JBgS3uiVuxKiwNuCwEFfJIWYod6RezFi-RGI_hE1MYrTJuyOR6GRoLwWJUkbwnvbSNNthkBh-aQ7oPAYxT-MSOagg_vjZdShIDA7OErwAw9eIm5S-JsbQcLz_ZoE572m3VZOBQjMsr2u8MUbMy13rljqqSTvBYq6AP3u_yhhDc1FF8W3uLeoMVO_geFEMwDNMQ5eiBJcA7L6pdHpWg5qlR_SLoY1rpCVy4i3ypxaD5VlNBtuB98s4TWcxcHe_1LhkYFuCqzfsCBultJ31H9s-_DjiN6d8xTPblrIPnbcZF-ARJr2-G4kKHLtI1KK60iv8rCZLnilPolb-fGSKrfSRd1W9GT2_eC4UknOxL9CJjS7ba_1tKvN0e7E3Hc-ih63J6c1epicoqYvmOXNfq9wHA1gIsZS4SgM4Q3o6AZry0VyYyty59n_4sKzHSwz88mhYKKXlPQ69oAdbidLIkIUJhyHCOb1VNcOxqiYKvxoFbkfWj0u-z1TzPuhfSeD2M-3vQ1a4DgCMUAO9e7wyHlKI5Ib-RjCmoG1U0sWGEVT9JG-Uh1HhDcbaioC8h2iRg_T7LMxVEWIa1ArpcMsehPy3xhVUMJljQW8ECAnah1rttQLCfYQU8NJ4ecQolBg6ci6nKVBxbKE8qQF1yS8Uuud2Ib17Mtu8W9CatXiZ0k5n0vcMfpX3vLlvFlBsFjX1W0B87s9a24ROkKo-tqgbjmhxE1ZkQ7S7lFEG6XV7RfC1MguHb0Hr-7KHpN9JlmqlBt0nXl84c7ny8HU2U23danLoIS4Szwbebwdf2neD0r5vXcPMzOOr5sHD59G67ShXWeXmr8FqUd-uMU0FRxr2ghUS2Rn5BLkmeK1Rf_cWDMd6oJxwqcbPm-A3Oug8aiGHVRK4baZT016H3dKzdb0kaVnCrKqCVJF67w7DiNnn0uUQdXGmkgq9mbhU9xJQPc_PYR9uOocU1fKQmYvF6_gauOH1K9ugAUrlzTRduxjKyvPAwPSqbI9Q_ydYcJ_45XLtZnZxBcG-7XawM6Tn-RAg-xYuZ0aOArulG3S-zpToKIpJlk6yNJzB95CMCT0HsT709HDEQEJGyM7F7qC7ECvM_hHvy6wSsGu4gdG6KSgpj03WL2M_OdT_k1iINfUL_INUUf9q9RaUucNbuZjfK3EtiTxSCcHFvaKjdrfgH6HXSD42GTZpUUze-KM2RthSIxpJc-cwQpZb-QTZVzchwVJIn7UpmEytAyxWURyAOu7WqtCKMfTQWwZYcZFAkliQymvXTIEDgvXLUeZMe4ny3svPhycG5fMLCk_ENdgblshNBicNwfl5W-qBeLGbsxwJrChWbDGaroRmyJifhm7HryuL8luMlCYtVUR-EdB3_nmR_BZnnfE8K-YG0VxQqzgvvSWt4St74nJtUQXCd4TIwybuncSar7aqNcAYr0q54_9ur7ZhzJoo4Kkiy4PFJVSbU_8gMoi4htEnA",
    "cf_clearance": "Sqg_yjbMQr4RIRbcKFd20mIQJu.mj.pbFSWdocXioyg-1787710419-1.2.1.1-ugZ5uOJ4VyVy76A8vad2IfCyTzOmyo36.rSP_uF21JE4d8RpopJVYXlXQI0_TYAzS1.9LioFYahq4ETOTlIxIAaacE14TAXL79UoI020fYgkB_g2V7200h7aysaS0CDEcYWxjxwakLbBC7lqHf9wVn0DI.kM1Znmpnhczw8TndP4oOiioBwlry6WoExVlBey6Oaj0Ec5QehmbC8u1n3xz7cWpDiw7GQLRt4pVQfI_NnLe4yR8uA8NNcJ.3ZP.kIZAvIRW7P3_JtRQcKZrUnR.nDeNj.i22Q_IE9be17VdifqHSQjBoCsh63NCau3rKNFKC.865_R8Gujx.wbtd0rdiEw9CSS8MxH32YOMAyF2t5qfMYGT02wZ8FqwnIo7LJnf6DeMjXa3XrSa3iNgCGKBMxqvwv9Pgv3C4dXjggGv8qobxnUW.xG.Amw9OgelWss96iuoRX.X_qzX7llMRa1Nj9eb0_58yH5Ky3RoKbm4X0gScOeD2Zu1vgBSrAKRU0r3AoG8SeP.C2YZd6IXO7Now",
    "history_off_6a8e4be8-ed8c-83e9-8d58-ca816ddbb200": "1",
    "__cflb": "0H28vzvP5FJafnkHxihKYsVesTuU7QoF7Hymgtt1PKZ",
    "__Host-next-auth.csrf-token": "53b10da84f1b19c1a75558d1025a3ec1a7635e624fd34d4a86db74f723dac867%7Ca9ce1ffb5026fdabc47d8076c440ace7979b7027acbebed8c263bc0329961efe",
    "_cfuvid": "27xIFbTc8FLndxvJ2g05wRIAH.NQH2fhm.rYcSkkDNU-1787793237.9231753-1.0.1.1-SjMeeA.8o2Y3F0_EXNiwe.UZqQ.yJI6Dne36ys.mmKk",
    "oai-gn": "Jeferson",
    "__Secure-next-auth.session-token.0": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..y4UnI1IqpmtgsSv2.Ih9knvZDw_H8Cuc6OweAtj3amga_M3yNQdr6CNf0KBG5JePCLjq_nW6bwyxs8mZap_HdoCYJEDFQq5XZ7RpDAqzjPMTMvJsw9D4ZVnn5b8vwSAfyC3AUBtG85YitbzbDxtLGm4wO6zD71Bk7qjyGq_zteeqmU3T_wWM4106-Qh1HWQng6ofkG2t_q07yKH4Yaw-bns48aSj8a41URW2HC5Bri8YVBnqe3QacBMZJr-XzVtH6jqXw9icdJbw2vRZRGyUXRHE61GV2iFMFJ9anNLQUobluFTu2PIlo0J7mwCe1hZH3qHNSiCAzgU4a44tADET_WNC-MCs2DOUNmNXOsPrX8zAZTugeP9q_FTESzyVmArz3004QeWBXqWETSTkDdCQx-TWbbIAbOjwX1sIW45vdgTlOp0zt8FNG-WEiI8VtU-FXMvJWbx92i4RyCsGSFIEWe810iJgTzxJE9TZ2sgiUNrjM1c7hJyXKOPE_mddPMHk94hn0EL7OfTfv4MqUPUQNTiS_e53zGV2D4GL0hW88cdcI8f5E3iCU4Z6WUrc1CziH2hpgFB1pgtVu08gYlBXEUDYZyK7OevaBZB9UPv4ToKBN7gj5gpTe2mVyeuan7Q0mIq-4w27LZn-mQZmHzvVLNGrsC7rfoq_omC9S5PaK7a2HRyqUnMnure9Z3JAjqvBwlxclt8nPuMvZDprVSGD2_S-3_vFwQrRPPKA8BaJpDHCFRcmTzFv4_z_SE1F83xB4Aw0mQGGxXut9voWv9K3QtN2WRzbSOAYqEtITNmI-3fHaH-U24-no81plDzQ8NZ4NLJnrBxfRb5z3MpPppkznZPTZiq8Asl0lGDUbe8vcoYhHGk_c8W3IFDkA80OoCv7PHzdz02iZSbwN_eY3_rvr6ZcVvn5ToBRqb8xHV_jBp3GQqzXEcpc58Ugexp0BxrIhqMcFse_kPsEspXWQ-NDz8TDjYyRwmsfu1m7ZjapBmCpyZJPNnLeu-55SGpaL-vKPMsBsrykFuLeHKYv9BvdNCNuJUzH3R_m0gnZxf7oOY1PfwmFKzDUFGP_oOP_-zqOaPDMGJXnr_DMSeYVfBfQWoSb51V2a8xZUmjCiKWZyb4mSaRm0pGu9cTuH9JN9pJrrel-DChBa0F1dUQ0WVxOYsmYPjj7u0kM_N7eVvQAduluDYcEBb3M5GF77Ivcc1bH3NLYf1IHLkeKkK3M_Wa1fy5q90WnXEHoGtQyb0w3aJt7ZGx1yFh_5kwIvs-aPwX6oZS68rUetaQnPOMvak_chuAbXkpYWBd-oUYxTF23HoO2Nu4j6V-kOjBbjvdG6dy9E-jFPl5bBvfVTbI7iDogYcWEaO4ELYTu7AThLW580dAWpQRUffb4w0QZQi-2-tsFC_4LiyM5_VPEUVLRuSYMZmECrNWjVn-ATziNbxhaOYiJvm1eZ1eQnjPlnxgnhkM7ZkuT_09V9BrLO-FWcpmKsEFfUkOcbpca_Y31n68AUCznIrIfzvH944-kOEiBhDtIYlBbAHNEls7xOUeDHbT8Uj71IoiyMt0rMfFHdKMjpdqCHYXGtLhenoCmuSuH3M4nLZm-6MvMVbRzA8UsWFX-1Ap1lmJIfzJ4haDYE8Oiv1Y0LrVMCZiNqq7yf106SSKJRosAlLlhWT3fLDobYoNkalNJ4orzsOo0oIYJQVLHNUqTgIBZMKnlrV3pQIQYWIAHRtaLr8rSMWMrGODQUb9-badxgyTqM97XMakXoWEyTZyc8EEO2l09MB7Si6Kq-5R_iELcG-khR8wEFpRzro7YSenLk__16Fm7zpzx3JtsIWrkftttDgx_CGtoSOyyeHycp03nD_l08nA43Mq9r_Me0_D586J03rVpB9zy-0abeMvJ6d4iHvsHCntKwnjqT97h964rx5XTNeCVcBqae5kBdTpyVnRILGK4mgkUlYJDVKu6qgkdN0o8JkdWUQAbofX5VcnpYtaE884rBXP1X8VAs_uVZhPfSHfz9mIXwcZLB_RWYvBAV5kuS1pWhTR-Xr_JuxyVSaEePmApmRgz-BSC45YF7n8ytne7-BR9TphHCSOvzB-d3WTVEdMjhdWyqqh6tL9yWspdnM1RU2yEDmybO5gaeeffqagScpmgyv7i3wm2kO_TYNm-2HwEeynNRoqAZEJ-ew8iJTkiy0UxWlAjzIq1yqP6tjP5kg8I_XWQ9rtX32ABzAkOz92WiiTnrfKzy3wq8DNWXQL2WfhH0b6Ta9yFCqUKHCsd4lQ_W3Zy6iQge-RiB9FZzbrJtEGWkSsIdb-tWKlucWTFhZGEzpZTj-uvu6HpFLH6UL9idtuC3dTcgnL3-lfc0IXJFFtWDEi8sXEE7OyxKxsgf9CgvhagC0TFX1U83ztCdu5IxUpx-1QdNoqRYaBHy08-XP3nZj8MJnKWd4ifsBCSHFA01bfUSkfYbkUYGi9eAhOtBbeEER0fCcPXALKHGZCZzJDBls3jTnxDDPy988Uizc2pWLkxhZ-QF3iYGDh_IVyI5OClwy4kUb5JDae3n1azqwV0Kt3NKlk2mhScXZBwJ0_KNHC6WK4ki__uZdtSoZic1-fetu7t2xxXUh-h1O4LqCZfE7hnYorhCCQTpm2ytQPLOx73qlfxPb-fSYgqLw70Lfn8pcuMy5ZKhrO0pB88RjSPm37JiH8-XmeDxJB5mqzStadk5lC1e48d6ESmIkT8fIIOL0B5OjhEtV34T4oNV7lybCCKibMfJG7gSCWfdZGev5FTxqqxdmU9VzXU3U-huoCqM1sWsZ0G6D0HkKqZuBDzRuCB8RtqjFAXrWyGLMoD8I4qwbpBNAFm_-aOen7A2RvCzvN0OE9cH07RWwykmLOqZoVUXdTmZCMaM_rBAzs6rKgq7bidptgoyBcHDRk6XXSjuFoGvvxePtS7nOHxlMi4nS5rL3BvcI60lutS2ilpzVPirZ7Q2XkaXb17d9XH8c05FKXhs4vWEcTqZqij2wwjk2auKGcGpqqJyVMeMT6v_SCT8-TAcMfD3KkzXtVfc2DcVduuqJg7Tu2Tu2Rj8UM7T0KSEHRqHnNiEk9As2tPPVwfVTOg8yC_-WK7_VKsbRYnTl0CHrGr4zQ8MNofhMSJ2IHL9lvHkJwPubntkgPp6gna53NgZjvGK8-1tbODeoO3TGqXklOV8MxQn9HWPdPIKblD3bLiIH_ICuVMSsdkXfQ1J6fXg--DxU8ZkJD1dQyShD13dTYBzwywNlRYdxBlpqfBCAajADpitIbZDmJ5uYMyF4jwWWuXm3KfddHx8E2wH4rfx6sqK5DuRdUfMMesqfI587SxsmvUqIfYIoEmCBZx3kUcyvfK7zRK0QTU4WCzlvfC7AjR3I5Z0MOg9UHoRm5E_ZouKuYDM7i1c9e20lG7SqgteiaQvOdjrCdJCZnMbbiE-DpNEfFCncn-3PTULJLBVObBLKQntpeOQGuMOiDTiXkZ60UR5oB4NgXgCY9_S98XU5ht3zgOkBfKZcG3BISsVsqQBReCThmVPvGpOlSMNWmDzsUWXZxN15JWS05zRAW5jvNc-DjEvrsGPrq1l_ejrnVaPvJpi_Lbp07NeyRNsNxGxUuZmobUrwsmsMWmieqm9ahXTTc14Z1neFSMnuts8igwKdskG30-DEfE2fwkq1SeO3kb17oyAeNR8CApIUFusLSwDnVr8oPhxcML6bBpfmsDSvTS_FaMtYq8fMbOlhp4Ds3cHAoqouc7GySAbjnKjHTqcwMSbKhXKrF35NOYZD7pyIPEn96_8Koa6KQw0Xmoug9zeXIUD1YW0jZ7RdFKJhGYxxraR5DOPeJ1mTAqoaPlQPwaVszhnnIYOc4oR_rWWeCZenKIDJAC5cGmFfEyl4w7Zx-j",
    "__Secure-next-auth.session-token.1": "ZkXKABotMaznWi5MwUno-eeOB1oAH2vM8xg9jFcJlk4Cr3UAZGycQfx_pyMJhjLA9pJHZU5QzBLn37qZsLDQMzCjvUI50K0NF.JT3nUZZsUHsLlWYYtm4iHw",
    "_puid": "user-oXR4zlslOKrqYU9oZuYTV9yC:1787793502-GUOOycXECzm5BzinR4V%2FOQOMMr%2BrlCMpLb1vH%2FKnKXU%3D",
    "__cf_bm": "IhWcV7D6imeQiVCSu4xDQyJ0Y_vlAtCFxr7.p.fAJ6Q-1787795332.429181-1.0.1.1-dcv.i17ILMTrT6AwOmvhWsPNWUvhbO9r2vfW4abhwhIbfkvxQCKbkO5W80J12DwkN64qlpVFVeuvWv9nx9fEfj.yEZtiCh.iy.Y_I89avribt29nN1X_ydLqRuhhYeE_",
    "__oailb": "eyJhbGciOiJFUzI1NiIsImtpZCI6Im9haWxiLXYxIiwidHlwIjoiSldUIn0.eyJob3N0IjoiY2hhdC5nYXRld2F5LnVuaWZpZWQtMTYwLmFwaS5vcGVuYWkuY29tIiwiaXNzIjoiZWRnZS1nYXRld2F5IiwiYXVkIjpbImNoYXRncHQuY29tIl0sImV4cCI6MTc4Nzc5OTQ3OSwiaWF0IjoxNzg3Nzk1NTc5fQ.IOz1_uoK-QvYxRcpVzfXbSSKC8FH1LcnZJTE78ytyk2PFdLZRMCZ5f674aE9sStIoDM36mDvE5B1ucs-Ru-e2g",
    "_uasid": '"Z0FBQUFBQnFqNWk0ZVhiYzJLMzhvNk9rYmx2TlBTYjBidVBjOWRzMDV2TzJPUllhSWxKMTNFYzVrb3otOEZDMkVVMHJPYUcyRGlXZHFRUHhBd21WekpUME0zeXZBR0HIX1JqX3RYTGNrWDJfLThqTFpxdE9sX0Z1c1JKZkRaT05Pc0VjODhZM1RucHZ6d2xwYzk1UjZZMFJZWXhTUC0xX1pXRFRiek9ZMjhZUi0teWNkT0lyT0U4cmtNdmZuanBMajA5QXg3VGFmVWVsNHV6aUl0QUo5WGxQS2xFU2hZbDBoMUtZS3NiekFVS2JNZVphblBueEdRbm1QYnQtTVppTGJ4X3BHWndDcnNxTWpsajR0clFXWm1wNHdCWnBnclNpZnBDaDF6VjNLMWtkcmdNbjVfYTJ2c2xlcmNmRXRXQlppVkdhanh1VmladURTWV82dzRmaWZqVzNKR1ZiUkQtN2pBPT0="',
    "_umsid": '"Z0FBQUFBQnFqNWk0T0Rla1ZLMFA0YWVSU01lSWhzSWNkMnA5ZFFuQTNUSTBaZ3h3X0tuLXNFRjdTeDN5WGRqa2hOUThxVVA5aThOb3JIbHVXV1l1c2ZENHB2cXBmWEVDeXk4anlsSUVMM2JGb0RqeUxCdnJEVGdua3QzbDQ2bGZVaG1EVGxBcTlvQ2RRdmJjVTd4endoOUNwWWxoS0E3Z2w4eDRqQ2ZGNFBpMVM5V2pIN1BVN2dhaWlEd2Y3NUFqOGFOdVZmbUhfMkwzSGlaZ1NWYTlqOG83anpxc3YzVVJ5ZTJWeE9TdG9IOFVvYUtxSDhURWQtaz0="',
    "oai-client-auth-info": "%7B%22isOptedOut%22%3Afalse%2C%22loggedInWithGoogleOneTap%22%3Atrue%2C%22user%22%3A%7B%22name%22%3A%22Jeferson%20Amorim%22%2C%22email%22%3A%22hypersizemultimidia%40gmail.com%22%2C%22picture%22%3A%22https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fje.png%22%2C%22connectionType%22%3A2%2C%22timestamp%22%3A1787795641585%7D%7D",
    "oai-sc": "0gAAAAABqj5jD13qwuI3H0aFfhlnb3itmchyDpAM7MlvxQLGauszJp6R0Dk7ujHcK2sOPqrkUKesdyKBstA822teV9bTcVIWzxqB7lU8VY-VYL3fz8V6RFkeBnkxLzNYt2auOUtYUrka7dmQRigO-hUzTi3aRhp9id-MoIJ_gKLhztYlJZTri6n3A6MroTU5EnkP6a9zfJeLEjH7d3y3cU-KAsiK52kp55f-M4p1zx0t5eWMYMn3xwvg",
    "oai-nav-state": "0",
    "_dd_s": "aid=c8199b03-264f-48eb-9b1f-63e00fda1e37&rum=0&expire=1787796568251&logs=1&id=7bed16d2-51be-4c22-ad23-b8d5221af1a1&created=1787792968543"
}

headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "Referer": "https://chatgpt.com/g/g-p-6a54f413e1c88191af9fc709cf4788ab-adsentice/c/6a8f985b-040c-83e9-ad00-d8073c66c58c",
    "Sec-Ch-Ua": '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    "Sec-Ch-Ua-Arch": '"x86"',
    "Sec-Ch-Ua-Bitness": '"64"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Linux"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin"
}

def main():
    session = requests.Session()
    session.headers.update(headers)
    session.cookies.update(cookies)

    resp = session.get(TARGET_URL)
    print(f"Status Code: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.json()
        out_file = os.path.join(OUTPUT_DIR, "chatgpt_conversation_data.json")
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✅ Conversa JSON salva com sucesso em: {out_file}")
        print(f"Title: {data.get('title')}")
        mapping = data.get('mapping', {})
        print(f"Total Nódulos/Mensagens: {len(mapping)}")
    else:
        print(f"Response snippet: {resp.text[:400]}")

if __name__ == "__main__":
    main()
