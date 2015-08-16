package com.jelly.jt8.bo.dao;

import java.sql.Connection;

/**
 * Created by user on 2015/8/15.
 */
public interface TransDateDao {
    public void generate(Connection conn, String exchange_id, String main_symbol_id) throws Exception;
}
