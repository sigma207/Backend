package com.jelly.jt8.bo.model;

/**
 * Created by user on 2015/8/17.
 */
public class SymbolTradableDaily {
    private String exchange_id;
    private String symbol_id;
    private String stock_name;
    private String last;
    private String total_volume;
    private String updown_per;
    private int tradable;

    public String getExchange_id() {
        return exchange_id;
    }

    public void setExchange_id(String exchange_id) {
        this.exchange_id = exchange_id;
    }

    public String getSymbol_id() {
        return symbol_id;
    }

    public void setSymbol_id(String symbol_id) {
        this.symbol_id = symbol_id;
    }

    public String getLast() {
        return last;
    }

    public void setLast(String last) {
        this.last = last;
    }

    public String getTotal_volume() {
        return total_volume;
    }

    public void setTotal_volume(String total_volume) {
        this.total_volume = total_volume;
    }

    public String getUpdown_per() {
        return updown_per;
    }

    public void setUpdown_per(String updown_per) {
        this.updown_per = updown_per;
    }

    public int getTradable() {
        return tradable;
    }

    public void setTradable(int tradable) {
        this.tradable = tradable;
    }

    public String getStock_name() {
        return stock_name;
    }

    public void setStock_name(String stock_name) {
        this.stock_name = stock_name;
    }
}
