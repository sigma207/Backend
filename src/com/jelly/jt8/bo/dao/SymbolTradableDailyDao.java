package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.model.SymbolTradableDaily;

import java.util.List;

/**
 * Created by user on 2015/8/17.
 */
public interface SymbolTradableDailyDao {
    List<SymbolTradableDaily> selectTemp() throws Exception;
    List<SymbolTradableDaily> selectTemp(MainSymbol mainSymbol) throws Exception;
}
