package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.Holiday;
import com.jelly.jt8.bo.model.MainSymbol;

import java.sql.Connection;
import java.util.List;

/**
 * Created by user on 2015/8/11.
 */
public interface HolidayDao {
    public List<Holiday> select(MainSymbol mainSymbol) throws Exception;
    public void insert(Connection connection,List<Holiday> holidayList) throws Exception;
    public void update(Connection connection,Holiday holiday) throws Exception;
    public void delete(Connection connection,Holiday holiday) throws Exception;
}
