package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.model.ErrorJson;
import com.jelly.jt8.bo.util.RsMapper;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by user on 2015/8/12.
 */

public class BaseDao {
    Class tableClass;
    final int batchSize = 1000;
    public void execute(Connection conn, String sql, List list, Class c) throws Exception {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            RsMapper.map(rs, list, c);
        } catch (Exception e) {
            throw e;
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (stmt != null) {
                    stmt.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public void parseError(int code, String message) throws Exception {
        if (code != 0 || !message.equals("")) {
            throw new Exception(message);
        }
    }
}
