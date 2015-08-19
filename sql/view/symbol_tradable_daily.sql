IF EXISTS(select * FROM sys.views where name = 'symbol_tradable_daily')
	drop view symbol_tradable_daily
go

CREATE VIEW symbol_tradable_daily AS
	SELECT a. exchange_id, a .symbol_id, i.stock_name, q.last , q. total_volume, q .updown_per, CASE WHEN s. exchange_id is NULL THEN 0 ELSE 1 END tradable
	FROM (
				 SELECT exchange_id, symbol_id
				 FROM symbol_quote_image
				 UNION
				 SELECT exchange_id, symbol_id
				 FROM symbol_stock_info
			 ) a
		LEFT JOIN symbol_quote_image q ON a .exchange_id = q.exchange_id AND a. symbol_id = q .symbol_id
		LEFT JOIN symbol_stock_daily s ON s. exchange_id = a .exchange_id AND s.symbol_id = a. symbol_id
		LEFT JOIN symbol_stock_info i on  a.exchange_id = i.exchange_id AND a. symbol_id = i .symbol_id