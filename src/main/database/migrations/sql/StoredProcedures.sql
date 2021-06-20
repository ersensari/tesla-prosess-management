CREATE PROCEDURE [dbo].[DOZAJ_BASLA]
    @productionId INT,
    @batchNo INT,
    @groupNo INT    
AS
BEGIN
	
	IF @batchNo>0 and @groupNo>0
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
        INSERT into ProductionGroups(productionId,groupId,batchNumber,[started],startedAt,finished,updatedAt,createdAt)
        VALUES(@productionId,@groupId,@batchNo,1,GETDATE(),0,GETDATE(),GETDATE())
        
        IF @batchNo=1
        BEGIN
	    	update Productions  set startedAt = GETDATE(), updatedAt =GETDATE() where id = @productionId  and startedAt is NULL 
        END
        
     END

     update Productions set selected = 0, updatedAt=GETDATE() where id = @productionId
   END  
END;


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
    
    	DECLARE @manual bit
    	select top 1 @manual = manual from DosingGroups dg where dg.[row] = @groupNo
    	IF @manual = 0 
			BEGIN    	
		        IF @silo1Amount>0
		        EXEC DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,1,@silo1Amount;
		        
		        IF @silo2Amount>0
		        EXEC DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,2,@silo2Amount;
		        
		        IF @silo3Amount>0
		        EXEC DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,3,@silo3Amount;
		        
		        IF @silo4Amount>0
		        EXEC DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,4,@silo4Amount;
		        
		        IF @silo5Amount>0
		        EXEC DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,5,@silo5Amount;
		        
		        IF @silo6Amount>0
		        EXEC DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,6,@silo6Amount;
		        
		        IF @silo7Amount>0
		        EXEC DOZAJ_BILGI_AL_CALC @productionId,@batchNo,@groupNo,7,@silo7Amount;
			END
		ELSE
		BEGIN 
			 insert into ProductionDetails(productionGroupId,groupId,siloId,rawMaterialId,dosingOrder,amount,consumptionAmount,diffAmount,diffPercent,createdAt,updatedAt)
		     select 
		        pg.id,dg.id,null,pf.rawMaterialId,pf.dosingOrder,pf.amount,
		        consumptionAmount=pf.amount ,diffAmount=0, diffPercent = 0,createdAt=getdate(), updatedAt=GETDATE()
		         from ProductionGroups pg 
		        JOIN DosingGroups dg on pg.groupId = dg.id
		        JOIN ProductionFormulas pf on pf.productionId=pg.productionId and pf.groupId=dg.id 		       
			 where pg.productionId=@productionId and batchNumber=@batchNo and dg.[row]=@groupNo 
		     
		END

		
		
        set @status=1
    END TRY
BEGIN CATCH
    set @status=0
    EXECUTE usp_GetErrorInfo;
END CATCH

END;


CREATE PROCEDURE dbo.DOZAJ_BILGI_AL_CALC
    @productionId INT,
    @batchNo INT,
    @groupNo INT,
    @dosingOrder INT,
    @amount DECIMAL(10,3)
AS
BEGIN
    
    IF EXISTS(select 1 from ProductionGroups pg 
        JOIN ProductionDetails pd on pg.id=pd.productionGroupId
        JOIN DosingGroups dg on pg.groupId = dg.id
        JOIN Silos s on s.id = pd.siloId        
     where pg.productionId=@productionId and pg.batchNumber=@batchNo and dg.[row]=@groupNo and pd.dosingOrder=@dosingOrder)
     BEGIN
        update pd set pd.consumptionAmount=@amount,pd.diffAmount=@amount- pd.amount, pd.diffPercent = (@amount - pd.amount)/pd.amount*100, pd.updatedAt=GETDATE()
            from ProductionGroups pg 
        JOIN ProductionDetails pd on pg.id=pd.productionGroupId
        JOIN DosingGroups dg on pg.groupId = dg.id
        JOIN Silos s on s.id = pd.siloId
     where pg.productionId=@productionId and batchNumber=@batchNo and dg.[row]=@groupNo and pd.dosingOrder=@dosingOrder
     END
     ELSE BEGIN
        insert into ProductionDetails(productionGroupId,groupId,siloId,rawMaterialId,dosingOrder,amount,consumptionAmount,diffAmount,diffPercent,createdAt,updatedAt)
        select 
        pg.id,dg.id,s.id,pf.rawMaterialId,pf.dosingOrder,pf.amount,
        consumptionAmount=@amount,diffAmount=@amount - pf.amount, diffPercent = (@amount - pf.amount)/pf.amount*100,createdAt=getdate(), updatedAt=GETDATE()
         from ProductionGroups pg 
        JOIN DosingGroups dg on pg.groupId = dg.id
        JOIN DosingGroupSilos dgs on dgs.dosingGroupId=dg.id
        JOIN Silos s on s.id = dgs.siloId
        JOIN ProductionFormulas pf on pf.productionId=pg.productionId and pf.groupId=dg.id and pf.siloId=s.id
     where pg.productionId=@productionId and batchNumber=@batchNo and dg.[row]=@groupNo and pf.dosingOrder=@dosingOrder

     END

    declare @total_amount decimal(10,3)
	select 
		@total_amount = sum(pd.consumptionAmount)	
	from productiongroups pg 
	join ProductionDetails pd  on pg.id = pd.productionGroupId 
	where pg.productionId =@productionId 
	
		
	update p set p.productionAmount = @total_amount, p.updatedAt =getdate()	
	FROM productions p where id=@productionId

END;

CREATE PROCEDURE dbo.DOZAJ_BITTI
    @productionId INT,
    @batchNo INT,
    @groupNo INT    
AS
BEGIN

	IF @batchNo>0 and @groupNo>0
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
	        INSERT into ProductionGroups(productionId,groupId,batchNumber,[started],startedAt,finished,finishedAt, updatedAt ,createdAt)
	        VALUES(@productionId,@groupId,@batchNo,1,GETDATE(),1,getdate(),GETDATE(),getdate())                
	     END
	
		update p set p.finishedAt =GETDATE(), p.updatedAt = GETDATE() 
		from Productions p  where p.id = @productionId and p.batchCount = @batchNo
		and (select count(*) from ProductionGroups pg where pg.productionId=p.id and pg.batchNumber=@batchNo and pg.finished=1)=5 --Yağ dozaj bittiğinde burası 6 olacak
		
	END
     
END;

CREATE PROCEDURE dbo.URETIM_RESET
    @productionId INT    
AS
BEGIN
declare @amount decimal(10,3)
select 
	@amount = sum(pd.consumptionAmount)	
from productiongroups pg 
join ProductionDetails pd  on pg.id = pd.productionGroupId 
where pg.productionId =@productionId 


update p set p.finishedAt = GETDATE(), p.explanation = p.explanation + ' - Üretim manual bitirildi', p.productionAmount = @amount, p.updatedAt =getdate()	
FROM productions p where id=@productionId and p.finishedAt  is NULL 

update ProductionGroups set finished =1, finishedAt = GETDATE(), updatedAt =GETDATE() 
where isnull(finished,0)=0

END;

-- Create procedure to retrieve error information.  
CREATE PROCEDURE usp_GetErrorInfo  
AS  
SELECT  
    ERROR_NUMBER() AS ErrorNumber  
    ,ERROR_SEVERITY() AS ErrorSeverity  
    ,ERROR_STATE() AS ErrorState  
    ,ERROR_PROCEDURE() AS ErrorProcedure  
    ,ERROR_LINE() AS ErrorLine  
    ,ERROR_MESSAGE() AS ErrorMessage;
