package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.HolidayExceptionDao;
import com.jelly.jt8.bo.model.HolidayException;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.util.RsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by user on 2015/8/12.
 */
@Repository("HolidayExceptionDao")
public class HolidayExceptionDaoImpl extends BaseDao implements HolidayExceptionDao {
    private final static String QUERY = "SELECT holiday_id, exchange_id, main_symbol_id, calendar, update_time, memo, rv FROM symbol_holiday_exception ";
    private final static String WHERE_MAIN_SYMBOL = "WHERE exchange_id = ? AND main_symbol_id = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<HolidayException> select(MainSymbol mainSymbol) throws Exception {
        List<HolidayException> list = new LinkedList<HolidayException>();
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY + WHERE_MAIN_SYMBOL);
            stmt.setString(1,mainSymbol.getExchange_id());
            stmt.setString(2, mainSymbol.getMain_symbol_id());

            rs = stmt.executeQuery();
            RsMapper.map(rs, list, HolidayException.class);
        } catch (Exception e){
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
        return list;
    }

    @Override
    public void insert(Connection connection,HolidayException holidayException) throws Exception {
        CallableStatement cs = null;
        Connection conn = null;

        try {
            conn = jt8Ds.getConnection();
            cs = conn.prepareCall("{call symbol_holiday_add(?,?,?,?)}");

            cs.setString(1, "''");
            cs.setString(2, exceptionList);
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
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void update(Connection connection,HolidayException holidayException) throws Exception {
        CallableStatement cs = null;
        Connection conn = null;

        try {
            conn = jt8Ds.getConnection();
            cs = conn.prepareCall("{call symbol_holiday_update(?,?,?,?)}");

            cs.setString(1, "''");
            cs.setString(2, holidayException);
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
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void delete(Connection connection,HolidayException holidayException) throws Exception {
        CallableStatement cs = null;
        Connection conn = null;

        try {
            conn = jt8Ds.getConnection();
            cs = conn.prepareCall("{call symbol_holiday_delete(?,?,?,?)}");

            cs.setInt(1, 0);
            cs.setInt(2, holiday_id);
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
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
