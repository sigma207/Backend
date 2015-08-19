package com.jelly.jt8.bo.service.impl;

import com.jelly.jt8.bo.dao.HolidayDao;
import com.jelly.jt8.bo.dao.SymbolTradableDailyDao;
import com.jelly.jt8.bo.model.Holiday;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.model.SymbolTradableDaily;
import com.jelly.jt8.bo.service.SymbolTradableDailyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by user on 2015/8/17.
 */
@Service("symbolTradableDailyService")
public class SymbolTradableDailyServiceImpl implements SymbolTradableDailyService {
    @Autowired
    @Qualifier("SymbolTradableDailyDao")
    private SymbolTradableDailyDao symbolTradableDailyDao;

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<SymbolTradableDaily> selectSymbolTradableDailyTemp() throws Exception {
        return symbolTradableDailyDao.selectTemp();
    }

    @Override
    public List<SymbolTradableDaily> selectSymbolTradableDailyTemp(MainSymbol mainSymbol) throws Exception {
        return symbolTradableDailyDao.selectTemp(mainSymbol);
    }

    @Override
    public void insertSymbolTradableDailyTemp(MainSymbol mainSymbol,List<SymbolTradableDaily> list) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            symbolTradableDailyDao.deleteTemp(conn, mainSymbol);
            symbolTradableDailyDao.insertTemp(conn, list);
            conn.commit();
        }catch (Exception e) {
            if (conn != null) {
                conn.rollback();
            }
            throw e;
        }finally {
            if (conn != null) {
                try {
                    conn.close();
                }catch (SQLException se){
                    se.printStackTrace();
                }
            }
        }
    }

    @Override
    public List<SymbolTradableDaily> selectSymbolTradableDaily(MainSymbol mainSymbol) throws Exception {
        return symbolTradableDailyDao.select(mainSymbol);
    }
}
