--Añadir la geolocation
alter table agency add [GeoLocation] GEOGRAPHY
go;


--- Eliminar datos vacios
delete from agency where lat = '' or lng = '';

---Actualizar Tabla
update agency set [GeoLocation] = geography::STPointFromText('POINT(' + CAST(lng 
AS nvarchar(255)) + ' ' + 
                CAST(lat AS nvarchar(255)) + ')', 4326)
GO;


--Crear el store procedure
CREATE PROCEDURE find_by_distance
@Distance int, 
@LAT varchar(255),
@LNG varchar(255)
as
begin
	declare @origin GEOGRAPHY;
	Set @origin = GEOGRAPHY::STGeomFromText('POINT(' + CAST(@LNG 
				AS nvarchar(255)) + ' ' + 
                CAST(@LAT AS nvarchar(255)) + ')', 4326);
    SELECT *,GeoLocation.STDistance(@Origin) Distance FROM agency
	WHERE @Origin.STDistance(GeoLocation) <= @Distance;
end
go

exec find_by_distance @Distance=2000,@Lat='-8.094947', @LNG='-79.049472';


--Trigger para parsear 
CREATE TRIGGER ParseLatLng
ON agency
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE p
    SET p.GeoLocation = geography::STPointFromText(
                           'POINT(' + CAST(i.lng AS nvarchar(255)) + ' ' + CAST(i.lat AS nvarchar(255)) + ')',
                           4326
                       )
    FROM agency p
    INNER JOIN INSERTED i ON p.agencyId = i.agencyId
    WHERE i.lat IS NOT NULL AND i.lng IS NOT NULL
          AND LTRIM(RTRIM(CAST(i.lat AS nvarchar(255)))) <> ''
          AND LTRIM(RTRIM(CAST(i.lng AS nvarchar(255)))) <> '';
END
GO


