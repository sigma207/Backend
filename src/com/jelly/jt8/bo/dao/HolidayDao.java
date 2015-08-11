package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.Holiday;

import java.util.List;

/**
 * Created by user on 2015/8/11.
 */
public interface HolidayDao {
    public List<Holiday> select() throws Exception;
    public void insert(Holiday holiday) throws Exception;
}
