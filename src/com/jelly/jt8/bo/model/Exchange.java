package com.jelly.jt8.bo.model;

import java.util.List;

/**
 * Created by user on 2015/8/14.
 */
public class Exchange {
    private String exchange_id;
    private List<MainSymbol> mainSymbolList;

    public String getExchange_id() {
        return exchange_id;
    }

    public void setExchange_id(String exchange_id) {
        this.exchange_id = exchange_id;
    }

    public List<MainSymbol> getMainSymbolList() {
        return mainSymbolList;
    }

    public void setMainSymbolList(List<MainSymbol> mainSymbolList) {
        this.mainSymbolList = mainSymbolList;
    }
}
