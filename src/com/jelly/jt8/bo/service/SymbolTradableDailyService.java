package com.jelly.jt8.bo.service;

import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.model.SymbolTradableDaily;

import java.util.List;

/**
 * Created by user on 2015/8/17.
 */
public interface SymbolTradableDailyService {
    List<SymbolTradableDaily> selectSymbolTradableDailyTemp() throws Exception;
    List<SymbolTradableDaily> selectSymbolTradableDailyTemp(MainSymbol mainSymbol) throws Exception;
    void insertSymbolTradableDailyTemp(MainSymbol mainSymbol,List<SymbolTradableDaily> list) throws Exception;
    List<SymbolTradableDaily> selectSymbolTradableDaily(MainSymbol mainSymbol) throws Exception;
}
