-- tesla_tesla.dbo.DosingGroups definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.DosingGroups;

CREATE TABLE DosingGroups (
	id int IDENTITY(1,1) NOT NULL,
	name nvarchar(255) COLLATE Turkish_CI_AS NULL,
	explanation nvarchar(255) COLLATE Turkish_CI_AS NULL,
	[row] int NULL,
	manual bit NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	CONSTRAINT PK__DosingGr__3213E83F514E48D0 PRIMARY KEY (id)
);


-- tesla_tesla.dbo.Formulas definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.Formulas;

CREATE TABLE Formulas (
	id int IDENTITY(1,1) NOT NULL,
	formulaNo nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	version int NOT NULL,
	name nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	shortName nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	explanation nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	formulaDate datetime NOT NULL,
	sapCode nvarchar(255) COLLATE Turkish_CI_AS NULL,
	sampleRate int NOT NULL,
	mixerBottomCoverOpeningTime int NOT NULL,
	mixerLowSpeedRunSet int NOT NULL,
	mixerHighSpeedRunSet int NOT NULL,
	mixerMixTime int NOT NULL,
	chopperEnginesRuningTime int NOT NULL,
	chopperEngine1Permit bit NOT NULL,
	chopperEngine2Permit bit NOT NULL,
	chopperEngine3Permit bit NOT NULL,
	dustExtractionPermit bit NOT NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	CONSTRAINT PK__Formulas__3213E83F0E0B3E63 PRIMARY KEY (id),
	CONSTRAINT UK_Formulas UNIQUE (formulaNo,version)
);
CREATE UNIQUE NONCLUSTERED INDEX UK_Formulas ON tesla_tesla.dbo.Formulas (formulaNo, version);


-- tesla_tesla.dbo.Productions definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.Productions;

CREATE TABLE Productions (
	id int IDENTITY(1,1) NOT NULL,
	formulaNo nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	version int NOT NULL,
	name nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	shortName nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	explanation nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	formulaDate datetime NOT NULL,
	sapCode nvarchar(255) COLLATE Turkish_CI_AS NULL,
	sampleRate int NOT NULL,
	mixerBottomCoverOpeningTime int NOT NULL,
	mixerLowSpeedRunSet int NOT NULL,
	mixerHighSpeedRunSet int NOT NULL,
	mixerMixTime int NOT NULL,
	chopperEnginesRuningTime int NOT NULL,
	chopperEngine1Permit bit NOT NULL,
	chopperEngine2Permit bit NOT NULL,
	chopperEngine3Permit bit NOT NULL,
	dustExtractionPermit bit NOT NULL,
	batchCount int NOT NULL,
	productionDate datetime NOT NULL,
	productionAmount decimal(10,3) NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	selected bit NULL,
	startedAt datetime NULL,
	finishedAt datetime NULL,
	CONSTRAINT PK__Producti__3213E83F02AF4472 PRIMARY KEY (id)
);


-- tesla_tesla.dbo.RawMaterials definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.RawMaterials;

CREATE TABLE RawMaterials (
	id int IDENTITY(1,1) NOT NULL,
	name nvarchar(255) COLLATE Turkish_CI_AS NULL,
	shortName nvarchar(255) COLLATE Turkish_CI_AS NULL,
	sapCode nvarchar(255) COLLATE Turkish_CI_AS NULL,
	rawNo nvarchar(255) COLLATE Turkish_CI_AS NULL,
	explanation nvarchar(255) COLLATE Turkish_CI_AS NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	CONSTRAINT PK__RawMater__3213E83F822D0CFB PRIMARY KEY (id)
);


-- tesla_tesla.dbo.Roles definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.Roles;

CREATE TABLE Roles (
	id int IDENTITY(1,1) NOT NULL,
	name nvarchar(255) COLLATE Turkish_CI_AS NULL,
	title nvarchar(255) COLLATE Turkish_CI_AS NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	CONSTRAINT PK__Roles__3213E83F9A151589 PRIMARY KEY (id)
);


-- tesla_tesla.dbo.SequelizeMeta definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.SequelizeMeta;

CREATE TABLE SequelizeMeta (
	name nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	CONSTRAINT PK__Sequeliz__72E12F1ADA9DD731 PRIMARY KEY (name),
	CONSTRAINT UQ__Sequeliz__72E12F1B0AF8FAD0 UNIQUE (name)
);
CREATE UNIQUE NONCLUSTERED INDEX UQ__Sequeliz__72E12F1B0AF8FAD0 ON tesla_tesla.dbo.SequelizeMeta (name);


-- tesla_tesla.dbo.Users definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.Users;

CREATE TABLE Users (
	id int IDENTITY(1,1) NOT NULL,
	username nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	password nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	firstName nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	lastName nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	[role] nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	CONSTRAINT PK__Users__3213E83FAA9415D3 PRIMARY KEY (id)
);


-- tesla_tesla.dbo.ProductionGroups definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.ProductionGroups;

CREATE TABLE ProductionGroups (
	id int IDENTITY(1,1) NOT NULL,
	productionId int NOT NULL,
	groupId int NOT NULL,
	batchNumber int NOT NULL,
	started bit NOT NULL,
	finished bit NOT NULL,
	startedAt datetime NULL,
	finishedAt datetime NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	CONSTRAINT PK__Producti__3213E83FF73EECD9 PRIMARY KEY (id),
	CONSTRAINT UK_ProductionGroups UNIQUE (productionId,groupId,batchNumber),
	CONSTRAINT FK__Productio__group__151B244E FOREIGN KEY (groupId) REFERENCES DosingGroups(id),
	CONSTRAINT FK__Productio__group__5441852A FOREIGN KEY (groupId) REFERENCES DosingGroups(id),
	CONSTRAINT FK__Productio__produ__534D60F1 FOREIGN KEY (productionId) REFERENCES Productions(id) ON DELETE CASCADE
);
CREATE UNIQUE NONCLUSTERED INDEX UK_ProductionGroups ON tesla_tesla.dbo.ProductionGroups (productionId, groupId, batchNumber);


-- tesla_tesla.dbo.Silos definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.Silos;

CREATE TABLE Silos (
	id int IDENTITY(1,1) NOT NULL,
	[row] int NOT NULL,
	code nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	name nvarchar(255) COLLATE Turkish_CI_AS NOT NULL,
	rawMaterialId int NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	CONSTRAINT PK__Silos__3213E83F560A08A2 PRIMARY KEY (id),
	CONSTRAINT FK__Silos__rawMateri__3F466844 FOREIGN KEY (rawMaterialId) REFERENCES RawMaterials(id)
);


-- tesla_tesla.dbo.DosingGroupSilos definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.DosingGroupSilos;

CREATE TABLE DosingGroupSilos (
	id int IDENTITY(1,1) NOT NULL,
	siloId int NOT NULL,
	dosingGroupId int NOT NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	CONSTRAINT PK__DosingGr__3213E83F596F67D4 PRIMARY KEY (id),
	CONSTRAINT UK_DosingGroupSilos UNIQUE (siloId,dosingGroupId),
	CONSTRAINT FK__DosingGro__dosin__44FF419A FOREIGN KEY (dosingGroupId) REFERENCES DosingGroups(id),
	CONSTRAINT FK__DosingGro__siloI__440B1D61 FOREIGN KEY (siloId) REFERENCES Silos(id)
);
CREATE UNIQUE NONCLUSTERED INDEX UK_DosingGroupSilos ON tesla_tesla.dbo.DosingGroupSilos (siloId, dosingGroupId);


-- tesla_tesla.dbo.FormulaDetails definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.FormulaDetails;

CREATE TABLE FormulaDetails (
	id int IDENTITY(1,1) NOT NULL,
	formulaId int NOT NULL,
	groupId int NOT NULL,
	siloId int NULL,
	rawMaterialId int NOT NULL,
	dosingOrder int NOT NULL,
	amount decimal(10,3) NOT NULL,
	shutoff1 decimal(10,3) NOT NULL,
	shutoff2 decimal(10,3) NOT NULL,
	shutoff3 decimal(10,3) NOT NULL,
	tolerance decimal(10,3) NOT NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	CONSTRAINT PK__FormulaD__3213E83F1F3A7E4C PRIMARY KEY (id),
	CONSTRAINT FK__FormulaDe__formu__4BAC3F29 FOREIGN KEY (formulaId) REFERENCES Formulas(id) ON DELETE CASCADE,
	CONSTRAINT FK__FormulaDe__group__4CA06362 FOREIGN KEY (groupId) REFERENCES DosingGroups(id),
	CONSTRAINT FK__FormulaDe__rawMa__4E88ABD4 FOREIGN KEY (rawMaterialId) REFERENCES RawMaterials(id),
	CONSTRAINT FK__FormulaDe__siloI__4D94879B FOREIGN KEY (siloId) REFERENCES Silos(id)
);


-- tesla_tesla.dbo.ProductionDetails definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.ProductionDetails;

CREATE TABLE ProductionDetails (
	id int IDENTITY(1,1) NOT NULL,
	productionGroupId int NOT NULL,
	groupId int NOT NULL,
	siloId int NULL,
	rawMaterialId int NOT NULL,
	dosingOrder int NOT NULL,
	amount decimal(10,3) NOT NULL,
	consumptionAmount decimal(10,3) NOT NULL,
	diffAmount decimal(10,3) NOT NULL,
	diffPercent decimal(10,2) NOT NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	CONSTRAINT PK__Producti__3213E83F7A0222F5 PRIMARY KEY (id),
	CONSTRAINT FK__Productio__group__70DDC3D8 FOREIGN KEY (groupId) REFERENCES DosingGroups(id),
	CONSTRAINT FK__Productio__produ__6FE99F9F FOREIGN KEY (productionGroupId) REFERENCES ProductionGroups(id) ON DELETE CASCADE,
	CONSTRAINT FK__Productio__rawMa__72C60C4A FOREIGN KEY (rawMaterialId) REFERENCES RawMaterials(id),
	CONSTRAINT FK__Productio__siloI__71D1E811 FOREIGN KEY (siloId) REFERENCES Silos(id)
);


-- tesla_tesla.dbo.ProductionFormulas definition

-- Drop table

-- DROP TABLE tesla_tesla.dbo.ProductionFormulas;

CREATE TABLE ProductionFormulas (
	id int IDENTITY(1,1) NOT NULL,
	productionId int NOT NULL,
	groupId int NOT NULL,
	siloId int NULL,
	rawMaterialId int NOT NULL,
	dosingOrder int NOT NULL,
	amount decimal(10,3) NOT NULL,
	shutoff1 decimal(10,3) NOT NULL,
	shutoff2 decimal(10,3) NOT NULL,
	shutoff3 decimal(10,3) NOT NULL,
	tolerance decimal(10,3) NOT NULL,
	createdAt datetime NOT NULL,
	updatedAt datetime NOT NULL,
	CONSTRAINT PK__Producti__3213E83F5EE53626 PRIMARY KEY (id),
	CONSTRAINT FK__Productio__group__76969D2E FOREIGN KEY (groupId) REFERENCES DosingGroups(id),
	CONSTRAINT FK__Productio__produ__75A278F5 FOREIGN KEY (productionId) REFERENCES Productions(id) ON DELETE CASCADE,
	CONSTRAINT FK__Productio__rawMa__787EE5A0 FOREIGN KEY (rawMaterialId) REFERENCES RawMaterials(id),
	CONSTRAINT FK__Productio__siloI__778AC167 FOREIGN KEY (siloId) REFERENCES Silos(id)
);