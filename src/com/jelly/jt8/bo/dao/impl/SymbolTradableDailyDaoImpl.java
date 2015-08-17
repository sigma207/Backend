package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.SymbolTradableDailyDao;
import com.jelly.jt8.bo.model.Holiday;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.model.SymbolTradableDaily;
import com.jelly.jt8.bo.util.RsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by user on 2015/8/17.
 */
@Repository("SymbolTradableDailyDao")
public class SymbolTradableDailyDaoImpl extends BaseDao implements SymbolTradableDailyDao {
    private final static String QUERY = "SELECT exchange_id, symbol_id, stock_name, last, total_volume, updown_per, tradable FROM symbol_tradable_daily_temp ";
    private final static String WHERE_MAIN_SYMBOL = "WHERE exchange_id = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<SymbolTradableDaily> selectTemp() throws Exception {
        List<SymbolTradableDaily> list = new LinkedList<SymbolTradableDaily>();
        execute(jt8Ds.getConnection(),QUERY,list,SymbolTradableDaily.class);
        return list;
    }

    @Override
    public List<SymbolTradableDaily> selectTemp(MainSymbol mainSymbol) throws Exception {
        List<SymbolTradableDaily> list =  new LinkedList<SymbolTradableDaily>();
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY + WHERE_MAIN_SYMBOL);
            stmt.setString(1,mainSymbol.getExchange_id());

            rs = stmt.executeQuery();
            RsMapper.map(rs, list, SymbolTradableDaily.class);
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
}
