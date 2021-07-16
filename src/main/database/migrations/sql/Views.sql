CREATE view FLAT_PRODUCTION_LIST as 
select 
detail.id[id],
p.id[productionId],
p.formulaNo,
p.sapCode,
p.name,
p.formulaDate,
p.[version],
p.batchCount,
p.productionDate,
p.productionAmount,
detail.startedAt,
detail.finishedAt,
detail.batchNumber,
detail.amount [targetTotal] ,  
detail.consumptionAmount [consumptionTotal]
from Productions p
cross APPLY (
    select
    min(pg.id)id, pg.batchNumber,sum(pd.amount)[amount], sum(pd.consumptionAmount) [consumptionAmount], MIN(pg.startedAt)[startedAt], Max(pg.finishedAt)[finishedAt]
     from ProductionGroups pg 
    JOIN ProductionDetails pd on pd.productionGroupId=pg.id
    where pg.productionId=p.id
    GROUP by pg.batchNumber
) as detail;

GO

CREATE view GROUPED_PRODUCTION_LIST as 
select  
ROW_NUMBER() over(order by name) id, 
*,consumptionTotal-targetTotal  diff, (consumptionTotal-targetTotal)/targetTotal *100 diffPercent from 
(SELECT
min(startedAt) startedAt,max(finishedAt)finishedAt ,
formulaNo ,name, SUM(targetTotal) targetTotal, SUM(consumptionTotal) consumptionTotal,count(1) batchCount,
     STUFF(
         (SELECT DISTINCT ',' + convert(nvarchar,productionId) 
          FROM FLAT_PRODUCTION_LIST
          WHERE formulaNo=a.formulaNo and name=a.name 
          FOR XML PATH (''))
          , 1, 1, '')  AS productionIds 
FROM FLAT_PRODUCTION_LIST AS a
GROUP BY formulaNo ,name) b

GO
-- dbo.AKTIF_URETIM source

CREATE view [dbo].[AKTIF_URETIM] as 
select 
	top 1
	p.id[URT_ID],
	p.batchCount [PRT_SAYI],
	CONVERT(INT,p.chopperEngine1Permit) [CHOPPER_IZIN],
  CONVERT(INT,p.chopperEngine2Permit) [HAM_KNT2_ONCE],
	p.chopperEnginesRuningTime [CHOPPER_SURE],
	CONVERT(INT,p.dustExtractionPermit) [TOZ_TOPLAMA_IZIN],
	p.mixerBottomCoverOpeningTime [MIX_KPK_PT_ZMN_SET],
	p.mixerHighSpeedRunSet[MIX_HIGH_SPEED],
	p.mixerLowSpeedRunSet[MIX_LOW_SPEED],
	p.mixerMixTime [MIX_KRS_ZMN_SET],
	p.sampleRate [MIX_SAMPLE_SCD],
	p.formulaNo[FRM_NO],
	convert(nvarchar(10),p.formulaDate,104)[FRM_TARIH],
	p.name[FRM_NAME],
	p.sapCode[FRM_SAP_KOD],
	p.shortName[FRM_KISAKOD],
	P.explanation[FRM_ACIKLAMA],
	p.version[FRM_VERSIYON]	
from Productions p 
WHERE p.selected = 1 
ORDER by p.id desc;
GO
-- dbo.SILO_HAMMADDE source

CREATE view SILO_HAMMADDE AS
select 
TOP  100 PERCENT
dg.[row][GRUP],s.[row] [SILO_NO], rm.shortName[DZX_SX_RAW_NAME], rm.rawNo [DZX_SX_RAW_KISAKOD], rm.id [DZX_SX_RAW_ID]
from DosingGroups dg
join DosingGroupSilos dgs on dg.id =dgs.dosingGroupId 
JOIN Silos s  on s.id  = dgs.siloId 
join RawMaterials rm  on s.rawMaterialId  = rm.id 
WHERE dg.manual =0
order by dg.row, s.row;
GO
-- dbo.URETIM_FORMUL source

CREATE view URETIM_FORMUL as 
select 
pf.productionId [ID],
dg.[row] [GRUP_NO],
pf.dosingOrder [DOS_ORDER],
dg.manual [MANUAL],

s.[row] [DZGX_SNODX_1],
rm.rawNo [DZGX_SILODX_KISAKOD],
rm.shortName [DZGX_SILODX_HMDNM],
pf.amount [DZGX_FRM_SCDDX],
pf.shutoff1 [DZGX_KESDX],
pf.shutoff3 [DZGX_ARAKESDX],
pf.tolerance [DZGX_TOLDX],
pf.rawMaterialId [DZGX_SILODX_RAWID]
from ProductionFormulas pf 
left join Silos s  on pf.siloId  = s.id
JOIN RawMaterials rm  on pf.rawMaterialId  = rm.id
join DosingGroups dg on pf.groupId = dg.id

where dg.Row<6;