package com.jelly.jt8.bo.service.impl;

import com.jelly.jt8.bo.dao.HolidayDao;
import com.jelly.jt8.bo.dao.SymbolTradableDailyDao;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.model.SymbolTradableDaily;
import com.jelly.jt8.bo.service.SymbolTradableDailyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by user on 2015/8/17.
 */
@Service("symbolTradableDailyService")
public class SymbolTradableDailyServiceImpl implements SymbolTradableDailyService {
    @Autowired
    @Qualifier("SymbolTradableDailyDao")
    private SymbolTradableDailyDao symbolTradableDailyDao;

    @Override
    public List<SymbolTradableDaily> selectSymbolTradableDailyTemp() throws Exception {
        return symbolTradableDailyDao.selectTemp();
    }

    @Override
    public List<SymbolTradableDaily> selectSymbolTradableDailyTemp(MainSymbol mainSymbol) throws Exception {
        return symbolTradableDailyDao.selectTemp(mainSymbol);
    }
}
