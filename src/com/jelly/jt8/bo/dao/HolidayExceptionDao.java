package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.Holiday;
import com.jelly.jt8.bo.model.HolidayException;
import com.jelly.jt8.bo.model.MainSymbol;

import java.sql.Connection;
import java.util.List;

/**
 * Created by user on 2015/8/12.
 */
public interface HolidayExceptionDao {
    public List<HolidayException> select(MainSymbol mainSymbol) throws Exception;
    public void insert(Connection connection,HolidayException holidayException) throws Exception;
    public void update(Connection connection,HolidayException holidayException) throws Exception;
    public void delete(Connection connection,HolidayException holidayException) throws Exception;
}
