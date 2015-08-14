package com.jelly.jt8.bo.model;

import java.util.List;

/**
 * Created by user on 2015/8/12.
 */
public class MainSymbol {
    private String exchange_id;
    private String main_symbol_id;
    private List<StockInfo> stockInfoList;

    public String getExchange_id() {
        return exchange_id;
    }

    public void setExchange_id(String exchange_id) {
        this.exchange_id = exchange_id;
    }

    public String getMain_symbol_id() {
        return main_symbol_id;
    }

    public void setMain_symbol_id(String main_symbol_id) {
        this.main_symbol_id = main_symbol_id;
    }

    public List<StockInfo> getStockInfoList() {
        return stockInfoList;
    }

    public void setStockInfoList(List<StockInfo> stockInfoList) {
        this.stockInfoList = stockInfoList;
    }
}
