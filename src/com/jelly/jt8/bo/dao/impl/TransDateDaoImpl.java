package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.TransDateDao;
import org.springframework.stereotype.Repository;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;

/**
 * Created by user on 2015/8/15.
 */
@Repository("TransDateDao")
public class TransDateDaoImpl extends BaseDao implements TransDateDao {
    @Override
    public void generate(Connection conn, String exchange_id, String main_symbol_id) throws Exception {
        CallableStatement cs = null;
        try {
            cs = conn.prepareCall("{call symbol_trans_date_generate(?,?,?,?)}");

            cs.setString(1,  exchange_id);
            cs.setString(2,  main_symbol_id);
            cs.registerOutParameter(3, Types.INTEGER);
            cs.registerOutParameter(4, Types.VARCHAR);

            cs.execute();
            parseError(cs.getInt(3), cs.getString(4));
        } catch (Exception e) {
            throw e;
        } finally {
            try {
                if (cs != null) {
                    cs.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
