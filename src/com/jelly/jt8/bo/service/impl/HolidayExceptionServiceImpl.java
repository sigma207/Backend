package com.jelly.jt8.bo.service.impl;

import com.jelly.jt8.bo.dao.HolidayDao;
import com.jelly.jt8.bo.dao.HolidayExceptionDao;
import com.jelly.jt8.bo.dao.MainSymbolDao;
import com.jelly.jt8.bo.dao.TransDateDao;
import com.jelly.jt8.bo.model.Holiday;
import com.jelly.jt8.bo.model.HolidayException;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.service.HolidayExceptionService;
import com.jelly.jt8.bo.util.SqlTool;
import com.jelly.jt8.common.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

/**
 * Created by user on 2015/8/12.
 */
@Service("holidayExceptionService")
public class HolidayExceptionServiceImpl implements HolidayExceptionService {
    @Autowired
    @Qualifier("HolidayDao")
    private HolidayDao holidayDao;

    @Autowired
    @Qualifier("HolidayExceptionDao")
    private HolidayExceptionDao holidayExceptionDao;

    @Autowired
    @Qualifier("TransDateDao")
    private TransDateDao transDateDao;

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<Holiday> selectHoliday(MainSymbol mainSymbol) throws Exception {
        return holidayDao.select(mainSymbol);
    }

    @Override
    public void insertHoliday(List<Holiday> holidayList) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            Map<String,Holiday> map = new HashMap<String,Holiday>();
            holidayDao.insert(conn, holidayList);
            for (Holiday holiday : holidayList) {
                if(!map.containsKey(holiday.getExchange_id()+ holiday.getMain_symbol_id())){
                    map.put(holiday.getExchange_id()+ holiday.getMain_symbol_id(),holiday);
                }
            }
            Set<String> keys =map.keySet();
            for (String key : keys) {
                transDateDao.generate(conn,  map.get(key).getExchange_id(),  map.get(key).getMain_symbol_id());
            }
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
    public void updateHoliday(Holiday holiday) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            holidayDao.update(conn, holiday);
            transDateDao.generate(conn, holiday.getExchange_id(), holiday.getMain_symbol_id());
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
    public void deleteHoliday(Holiday holiday) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            holidayDao.delete(conn, holiday);
            transDateDao.generate(conn, holiday.getExchange_id(), holiday.getMain_symbol_id());
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
    public List<HolidayException> selectHolidayException(MainSymbol mainSymbol) throws Exception {
        return holidayExceptionDao.select(mainSymbol);
    }

    @Override
    public void insertHolidayException(List<HolidayException> holidayExceptionList) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            Map<String,HolidayException> map = new HashMap<String,HolidayException>();
            holidayExceptionDao.insert(conn, holidayExceptionList);
            for (HolidayException holidayException : holidayExceptionList) {
                if(!map.containsKey(holidayException.getExchange_id()+ holidayException.getMain_symbol_id())){
                    map.put(holidayException.getExchange_id()+ holidayException.getMain_symbol_id(),holidayException);
                }
            }
            Set<String> keys =map.keySet();
            for (String key : keys) {
                transDateDao.generate(conn,  map.get(key).getExchange_id(),  map.get(key).getMain_symbol_id());
            }
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
    public void updateHolidayException(HolidayException holidayException) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            holidayExceptionDao.update(conn, holidayException);
            transDateDao.generate(conn, holidayException.getExchange_id(), holidayException.getMain_symbol_id());
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
    public void deleteHolidayException(HolidayException holidayException) throws Exception {
        Connection conn = null;
        try {
            conn = jt8Ds.getConnection();
            conn.setAutoCommit(false);
            holidayExceptionDao.delete(conn, holidayException);
            transDateDao.generate(conn, holidayException.getExchange_id(), holidayException.getMain_symbol_id());
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
}
