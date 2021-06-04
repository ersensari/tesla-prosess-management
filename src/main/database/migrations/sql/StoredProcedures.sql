-- Create a new stored procedure called 'DOZAJ_BASLA' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'DOZAJ_BASLA'
    AND ROUTINE_TYPE = N'PROCEDURE'
)
DROP PROCEDURE dbo.DOZAJ_BASLA
GO

CREATE PROCEDURE dbo.DOZAJ_BASLA
    @productionId INT,
    @batchNo INT,
    @groupNo INT    
AS
BEGIN

    IF EXISTS(select 1 from ProductionGroups pg 
        JOIN DosingGroups dg on pg.groupId = dg.id
     where pg.productionId=@productionId and batchNumber=@batchNo and dg.[row]=@groupNo)
     BEGIN
        update pg set pg.[started]=1, pg.startedAt=GETDATE(), pg.updatedAt=GETDATE() 
        from ProductionGroups pg 
        JOIN DosingGroups dg on pg.groupId = dg.id
        where pg.productionId=@productionId and batchNumber=@batchNo and dg.[row]=@groupNo 
     END
     ELSE
     BEGIN
        DECLARE @groupId INT
        select @groupId = id from DosingGroups where [row]=@groupNo
        INSERT into ProductionGroups(productionId,groupId,batchNumber,[started],startedAt,createdAt)
        VALUES(@productionId,@groupId,@batchNo,1,GETDATE(),GETDATE())
     END

END
GO

-- Create a new stored procedure called 'DOZAJ_BITTI' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'DOZAJ_BITTI'
    AND ROUTINE_TYPE = N'PROCEDURE'
)
DROP PROCEDURE dbo.DOZAJ_BITTI
GO

CREATE PROCEDURE dbo.DOZAJ_BITTI
    @productionId INT,
    @batchNo INT,
    @groupNo INT    
AS
BEGIN

    IF EXISTS(select 1 from ProductionGroups pg 
        JOIN DosingGroups dg on pg.groupId = dg.id
     where pg.productionId=@productionId and batchNumber=@batchNo and dg.[row]=@groupNo)
     BEGIN
        update pg set pg.[finished]=1, pg.finishedAt=GETDATE(), pg.updatedAt=GETDATE() 
        from ProductionGroups pg 
        JOIN DosingGroups dg on pg.groupId = dg.id
        where pg.productionId=@productionId and batchNumber=@batchNo and dg.[row]=@groupNo 
     END
     ELSE
     BEGIN
        DECLARE @groupId INT
        select @groupId = id from DosingGroups where [row]=@groupNo
        INSERT into ProductionGroups(productionId,groupId,batchNumber,[started],startedAt,finished,finishedAt, createdAt)
        VALUES(@productionId,@groupId,@batchNo,1,GETDATE(),1,getdate(),GETDATE())
     END

END
GO

-- Create a new stored procedure called 'DOZAJ_BILGI_AL_CALC' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'DOZAJ_BILGI_AL_CALC'
    AND ROUTINE_TYPE = N'PROCEDURE'
)
DROP PROCEDURE dbo.DOZAJ_BILGI_AL_CALC
GO

CREATE PROCEDURE dbo.DOZAJ_BILGI_AL_CALC
    @productionId INT,
    @batchNo INT,
    @groupNo INT,
    @siloNo INT,
    @amount DECIMAL(10,3)
AS
BEGIN
    
    IF EXISTS(select 1 from ProductionGroups pg 
        JOIN ProductionDetails pd on pg.id=pd.productionGroupId
        JOIN DosingGroups dg on pg.groupId = dg.id
        JOIN DosingGroupSilos dgs on dgs.dosingGroupId=dg.id
        JOIN Silos s on s.id = dgs.siloId        
     where pg.productionId=@productionId and pg.batchNumber=@batchNo and dg.[row]=@groupNo and s.[row]=@siloNo)
     BEGIN
        update pd set pd.consumptionAmount=@amount,pd.diffAmount=@amount- pd.amount, pd.diffPercent = (@amount - pd.amount)/pd.amount*100, pd.updatedAt=GETDATE()
            from ProductionGroups pg 
        JOIN ProductionDetails pd on pg.id=pd.productionGroupId
        JOIN DosingGroups dg on pg.groupId = dg.id
        JOIN DosingGroupSilos dgs on dgs.dosingGroupId=dg.id
        JOIN Silos s on s.id = dgs.siloId
     where pg.productionId=@productionId and batchNumber=@batchNo and dg.[row]=@groupNo and s.[row]=@siloNo
          END
     ELSE
     BEGIN
        insert into ProductionDetails(productionGroupId,groupId,siloId,rawMaterialId,dosingOrder,amount,consumptionAmount,diffAmount,diffPercent,createdAt,updatedAt)
        select 
        pg.id,dg.id,s.id,pf.rawMaterialId,pf.dosingOrder,pf.amount,
        consumptionAmount=@amount,diffAmount=@amount - pf.amount, diffPercent = (@amount - pf.amount)/pf.amount*100,createdAt=getdate(), updatedAt=GETDATE()
         from ProductionGroups pg 
        JOIN DosingGroups dg on pg.groupId = dg.id
        JOIN DosingGroupSilos dgs on dgs.dosingGroupId=dg.id
        JOIN Silos s on s.id = dgs.siloId
        JOIN ProductionFormulas pf on pf.productionId=pg.productionId and pf.groupId=dg.id and pf.siloId=s.id
     where pg.productionId=@productionId and batchNumber=@batchNo and dg.[row]=@groupNo and s.[row]=@siloNo

     END

END
GO

-- Create a new stored procedure called 'DOZAJ_BILGI_AL' in schema 'dbo'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'dbo'
    AND SPECIFIC_NAME = N'DOZAJ_BILGI_AL'
    AND ROUTINE_TYPE = N'PROCEDURE'
)
DROP PROCEDURE dbo.DOZAJ_BILGI_AL
GO

--EXEC DOZAJ_BILGI_AL(uretim_id,batch_no,dozaj_grup_no,silo1Amount,silo2Amount,silo3Amount,silo4Amount,silo5Amount,silo6Amount,silo7Amount,out status)

CREATE PROCEDURE dbo.DOZAJ_BILGI_AL
    @productionId INT,
    @batchNo INT,
    @groupNo INT,
    @silo1Amount DECIMAL(10,3),
    @silo2Amount DECIMAL(10,3),
    @silo3Amount DECIMAL(10,3),
    @silo4Amount DECIMAL(10,3),
    @silo5Amount DECIMAL(10,3),
    @silo6Amount DECIMAL(10,3),
    @silo7Amount DECIMAL(10,3),
    @status BIT OUTPUT    
AS
BEGIN

    BEGIN TRY
        IF @silo1Amount>0
        EXECUTE DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,1,@silo1Amount;
        
        IF @silo2Amount>0
        EXECUTE DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,2,@silo2Amount;
        
        IF @silo3Amount>0
        EXECUTE DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,3,@silo3Amount;
        
        IF @silo4Amount>0
        EXECUTE DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,4,@silo4Amount;
        
        IF @silo5Amount>0
        EXECUTE DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,5,@silo5Amount;
        
        IF @silo6Amount>0
        EXECUTE DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,6,@silo6Amount;
        
        IF @silo7Amount>0
        EXECUTE DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,7,@silo7Amount;

        set @status=1
    END TRY
BEGIN CATCH
    set @status=0
    EXECUTE usp_GetErrorInfo;
END CATCH

END
GO

