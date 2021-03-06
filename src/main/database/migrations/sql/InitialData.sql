INSERT INTO Roles (name,title,createdAt,updatedAt) VALUES
	 (N'admin',N'Süper Yönetici',N'2021-05-24 12:09:27.637 ',N'2021-05-24 12:09:27.637 '),
	 (N'operator',N'Operatör',N'2021-05-24 12:09:27.637 ',N'2021-05-24 12:09:27.637 '),
	 (N'supervizor',N'Vardiya Amiri',N'2021-05-24 12:09:27.637 ',N'2021-05-24 12:09:27.637 '),
	 (N'manager',N'Yönetici',N'2021-05-24 12:09:27.637 ',N'2021-05-24 12:09:27.637 '),
	 (N'reporter',N'Rapor Kullanıcısı',N'2021-05-24 12:09:27.637 ',N'2021-05-24 12:09:27.637 ');
	
GO
INSERT INTO Users (username,password,firstName,lastName,[role],createdAt,updatedAt) VALUES
	 (N'admin',N'b49a6e9ec6',N'Tesla',N'Yönetici',N'admin',N'2021-05-24 13:08:19.433 ',N'2021-05-24 13:08:19.433 ');

GO
   INSERT INTO DosingGroups (name,explanation,[row],manual,createdAt,updatedAt) VALUES
	 (N'Hammadde1',NULL,1,0,N'2021-02-21 00:00:00 ',N'2021-02-21 00:00:00 '),
	 (N'Hammadde2',NULL,2,0,N'2021-02-21 00:00:00 ',N'2021-02-21 00:00:00 '),
	 (N'Additive1',NULL,3,0,N'2021-02-21 00:00:00 ',N'2021-02-21 00:00:00 '),
	 (N'Additive2',NULL,4,0,N'2021-02-21 00:00:00 ',N'2021-02-21 00:00:00 '),
	 (N'Manual Additive',NULL,5,1,N'2021-02-21 00:00:00 ',N'2021-02-21 00:00:00 '),
	 (N'Yağ',NULL,6,0,N'2021-02-21 00:00:00 ',N'2021-02-21 00:00:00 ');
GO
   INSERT INTO DosingGroupSilos (siloId,dosingGroupId,createdAt,updatedAt) VALUES
	 (2,1,N'2021-02-21 00:00:00 ',N'2021-02-21 00:00:00 '),
	 (3,1,N'2021-02-21 00:00:00 ',N'2021-02-21 00:00:00 '),
	 (4,1,N'2021-02-28 17:24:26.64 ',N'2021-02-28 17:24:26.64 '),
	 (5,1,N'2021-02-28 17:24:26.64 ',N'2021-02-28 17:24:26.64 '),
	 (6,1,N'2021-02-28 17:24:26.64 ',N'2021-02-28 17:24:26.64 '),
	 (7,1,N'2021-02-28 17:24:26.64 ',N'2021-02-28 17:24:26.64 '),
	 (8,1,N'2021-02-28 17:24:26.64 ',N'2021-02-28 17:24:26.64 '),
	 (9,2,N'2021-02-28 17:25:32.3233333 ',N'2021-02-28 17:25:32.3233333 '),
	 (10,2,N'2021-02-28 17:25:32.3233333 ',N'2021-02-28 17:25:32.3233333 '),
	 (11,2,N'2021-02-28 17:25:32.3233333 ',N'2021-02-28 17:25:32.3233333 ');
GO
INSERT INTO DosingGroupSilos (siloId,dosingGroupId,createdAt,updatedAt) VALUES
	 (12,2,N'2021-02-28 17:25:32.3233333 ',N'2021-02-28 17:25:32.3233333 '),
	 (13,2,N'2021-02-28 17:25:32.3233333 ',N'2021-02-28 17:25:32.3233333 '),
	 (14,2,N'2021-02-28 17:25:32.3233333 ',N'2021-02-28 17:25:32.3233333 '),
	 (15,2,N'2021-02-28 17:25:32.3233333 ',N'2021-02-28 17:25:32.3233333 '),
	 (17,3,N'2021-02-28 17:26:26.1366667 ',N'2021-02-28 17:26:26.1366667 '),
	 (18,3,N'2021-02-28 17:26:26.1366667 ',N'2021-02-28 17:26:26.1366667 '),
	 (19,3,N'2021-02-28 17:26:26.1366667 ',N'2021-02-28 17:26:26.1366667 '),
	 (20,3,N'2021-02-28 17:26:26.1366667 ',N'2021-02-28 17:26:26.1366667 '),
	 (21,3,N'2021-02-28 17:26:26.1366667 ',N'2021-02-28 17:26:26.1366667 '),
	 (22,4,N'2021-02-28 17:27:15.8366667 ',N'2021-02-28 17:27:15.8366667 ');
GO
INSERT INTO DosingGroupSilos (siloId,dosingGroupId,createdAt,updatedAt) VALUES
	 (23,4,N'2021-02-28 17:27:15.8366667 ',N'2021-02-28 17:27:15.8366667 '),
	 (24,4,N'2021-02-28 17:27:15.8366667 ',N'2021-02-28 17:27:15.8366667 '),
	 (25,4,N'2021-02-28 17:27:15.8366667 ',N'2021-02-28 17:27:15.8366667 '),
	 (26,4,N'2021-02-28 17:27:15.8366667 ',N'2021-02-28 17:27:15.8366667 '),
	 (27,4,N'2021-02-28 17:27:15.8366667 ',N'2021-02-28 17:27:15.8366667 '),
	 (28,4,N'2021-02-28 17:27:15.8366667 ',N'2021-02-28 17:27:15.8366667 '),
	 (29,6,N'2021-02-28 17:27:48.86 ',N'2021-02-28 17:27:48.86 ');
GO
SET IDENTITY_INSERT RawMaterials ON;
INSERT INTO RawMaterials (id,name,shortName,sapCode,rawNo,explanation,createdAt,updatedAt) VALUES
	 (3,N'aaaaabbbbb',N'DENEME',N'123456',N'q123455',NULL,N'2021-02-21 00:00:00 ',N'2021-02-28 08:01:46.694 '),
	 (25,N'Deneme - 28',N'DENEME',N'123456',N'123455-q',NULL,N'2021-02-21 00:00:00 ',N'2021-03-07 10:11:33.845 '),
	 (31,N'YIKAMA KALSİDİ',N'YIKAMA',N'-',N'148',N'YIKAMA KALSİDİ',N'2021-02-21 00:00:00 ',N'2021-03-01 22:54:02.475 '),
	 (36,N'Deneme - 17',N'DENEME',N'123456',N'123455-p',NULL,N'2021-02-21 00:00:00 ',N'2021-03-07 10:12:56.256 '),
	 (37,N'Deneme - 16',N'DENEME-16',N'123456',N'123455pk',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 14:28:02.958 '),
	 (38,N'Deneme - 15',N'DENEME-15',N'123456',N'123455-pk',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 14:27:56.231 '),
	 (39,N'Deneme - 14',N'DENEME',N'123456',N'123455-pl',NULL,N'2021-02-21 00:00:00 ',N'2021-03-07 10:25:37.835 '),
	 (40,N'Deneme - 13',N'DENEME',N'123456',N'123455-pj',NULL,N'2021-02-21 00:00:00 ',N'2021-03-07 10:25:44.714 '),
	 (41,N'Deneme - 12',N'dede',N'123456',N'123455-as',NULL,N'2021-02-21 00:00:00 ',N'2021-03-07 10:45:09.777 '),
	 (42,N'PBFM2',N'PBFM2',N'136334',N'136334',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 08:00:05.812 ');
INSERT INTO RawMaterials (id,name,shortName,sapCode,rawNo,explanation,createdAt,updatedAt) VALUES
	 (43,N'additive 1',N'additive 1',N'123455-cc',N'123455-cc',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 08:03:56.973 '),
	 (44,N'Deneme - 9',N'DENEME-9',N'123456',N'123455-bb',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 14:27:37.951 '),
	 (45,N'Deneme - 8',N'DENEME-8',N'123456',N'123455-asas',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 14:27:31.714 '),
	 (46,N'Deneme - 7',N'DENEME',N'123456',N'123455-bvbvb',NULL,N'2021-02-21 00:00:00 ',N'2021-03-07 11:08:15.084 '),
	 (47,N'OPTİBENT 426',N'OPTİBENT 426',N'127101',N'127101',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 07:55:07.692 '),
	 (48,N'KALKER 0-710 MW',N'KALKER 0-710 MW',N'6HD0518',N'6HD0518',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 07:55:40.766 '),
	 (49,N'TYLOSE MH 2005 P4',N'TYLOSE MH 2005 P4',N'120031',N'120031',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 07:56:14.803 '),
	 (50,N'WEBER.THERM SV KRAFT TORBA 25 KG',N'THERM SV KRAFT',N'105599',N'105599',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 07:57:06.428 '),
	 (51,N'STRECHOOD (120 MICRON) 100*65 VATAN',N'STRECHOOD (120 MICRON)',N'135168',N'135168',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 07:57:47.108 '),
	 (52,N'PALET ALTI ÖRTÜSÜ RULO 120 CM 50 MIC',N'PALET ALTI ÖRTÜSÜ RULO 120 CM 50 MIC',N'106249',N'106249',NULL,N'2021-02-21 00:00:00 ',N'2021-06-15 07:59:07.379 ');
INSERT INTO RawMaterials (id,name,shortName,sapCode,rawNo,explanation,createdAt,updatedAt) VALUES
	 (53,N'ededeerer',N'eererer',N'ererer',N'123556666',N'ererer',N'2021-02-27 21:07:49.792 ',N'2021-02-27 21:07:49.792 '),
	 (56,N'123123',N'12312',N'123123',N'213123123123',N'123123123',N'2021-02-27 21:24:33.397 ',N'2021-02-27 21:24:33.397 '),
	 (58,N'555',N'555',N'555',N'5555',NULL,N'2021-02-27 21:25:48.636 ',N'2021-02-27 21:25:48.636 '),
	 (61,N'222',N'222',N'222',N'2222',N'222',N'2021-02-27 21:47:38.747 ',N'2021-02-27 21:47:38.747 '),
	 (62,N'BOŞ',N'BOS',N'000',N'0000',NULL,N'2021-02-28 10:07:38.818 ',N'2021-03-27 11:40:25.793 '),
	 (64,N'asdasd',N'asdasd',N'asdasd',N'asdasdasd',N'',N'2021-03-07 09:27:25.569 ',N'2021-03-07 09:27:25.569 '),
	 (67,N'PORTLAND ÇİMENTO CEM I 42,5R',N'PORT.ÇİM.CEM I ',N'105500',N'105500',NULL,N'2021-03-07 11:08:19.718 ',N'2021-06-15 07:54:36.167 ');
SET IDENTITY_INSERT RawMaterials OFF;
GO
   INSERT INTO Silos ([row],code,name,rawMaterialId,createdAt,updatedAt) VALUES
	 (1,N'SL01',N'SILO 01',48,N'2021-02-21 00:00:00 ',N'2021-06-15 11:08:27.608 '),
	 (2,N'SL02',N'SILO 02',51,N'2021-02-21 00:00:00 ',N'2021-06-15 08:01:01.024 '),
	 (3,N'SL03',N'SILO 03',67,N'2021-02-28 16:53:44.8533333 ',N'2021-06-15 08:01:07.216 '),
	 (4,N'SL04',N'SILO 04',41,N'2021-02-28 16:53:44.8533333 ',N'2021-06-15 08:04:35.664 '),
	 (5,N'SL05',N'SILO 05',62,N'2021-02-28 16:53:44.8566667 ',N'2021-06-15 08:01:55.44 '),
	 (6,N'SL06',N'SILO 06',62,N'2021-02-28 16:53:44.8566667 ',N'2021-06-15 08:01:29.248 '),
	 (7,N'SL07',N'SILO 07',47,N'2021-02-28 16:53:44.86 ',N'2021-06-15 08:01:46.656 '),
	 (1,N'SL08',N'SILO 08',45,N'2021-02-28 16:53:44.86 ',N'2021-06-15 08:02:33.425 '),
	 (2,N'SL09',N'SILO 09',44,N'2021-02-28 16:53:44.86 ',N'2021-06-15 09:55:24.155 '),
	 (3,N'SL10',N'SILO 10',62,N'2021-02-28 16:53:44.8666667 ',N'2021-02-28 22:20:03.093 ');
GO
INSERT INTO Silos ([row],code,name,rawMaterialId,createdAt,updatedAt) VALUES
	 (4,N'SL11',N'SILO 11',62,N'2021-02-28 16:53:44.8666667 ',N'2021-02-28 22:20:05.495 '),
	 (5,N'SL12',N'SILO 12',38,N'2021-02-28 16:53:44.87 ',N'2021-06-15 08:02:47.496 '),
	 (6,N'SL13',N'SILO 13',62,N'2021-02-28 16:53:44.8733333 ',N'2021-02-28 22:20:10.755 '),
	 (7,N'SL14',N'SILO 14',37,N'2021-02-28 16:53:44.8733333 ',N'2021-06-15 08:02:52.865 '),
	 (1,N'ADT201',N'ADT 201',42,N'2021-02-28 16:53:44.88 ',N'2021-06-15 08:03:09.496 '),
	 (2,N'ADT202',N'ADT 202',52,N'2021-02-28 16:53:44.88 ',N'2021-06-15 08:03:23.864 '),
	 (3,N'ADT203',N'ADT 203',62,N'2021-02-28 16:53:44.8833333 ',N'2021-02-28 22:20:26.366 '),
	 (4,N'ADT204',N'ADT 204',43,N'2021-02-28 16:53:44.8833333 ',N'2021-06-15 09:52:28.969 '),
	 (5,N'ADT205',N'ADT 205',62,N'2021-02-28 16:53:44.8833333 ',N'2021-02-28 22:20:31.364 '),
	 (1,N'ADT206',N'ADT 206',45,N'2021-02-28 16:53:44.8866667 ',N'2021-06-15 08:04:42.544 ');
GO
INSERT INTO Silos ([row],code,name,rawMaterialId,createdAt,updatedAt) VALUES
	 (2,N'ADT207',N'ADT 207',62,N'2021-02-28 16:53:44.8866667 ',N'2021-02-28 22:20:35.815 '),
	 (3,N'ADT208',N'ADT 208',64,N'2021-02-28 16:53:44.8866667 ',N'2021-06-15 10:55:32.144 '),
	 (4,N'ADT209',N'ADT 209',62,N'2021-02-28 16:53:44.89 ',N'2021-02-28 22:20:39.927 '),
	 (5,N'ADT210',N'ADT 210',31,N'2021-02-28 16:53:44.89 ',N'2021-06-15 08:05:00.264 '),
	 (6,N'ADT211',N'ADT 211',49,N'2021-02-28 16:53:44.89 ',N'2021-03-15 13:02:38.359 '),
	 (7,N'ADT212',N'ADT 212',62,N'2021-02-28 16:53:44.8966667 ',N'2021-02-28 22:20:51.853 '),
	 (1,N'YAG01',N'YAG 01',62,N'2021-02-28 17:03:07.2566667 ',N'2021-02-28 22:20:56.184 ');