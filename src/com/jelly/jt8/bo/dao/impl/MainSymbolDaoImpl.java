package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.MainSymbolDao;
import com.jelly.jt8.bo.model.MainSymbol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by user on 2015/8/15.
 */
@Repository("MainSymbolDao")
public class MainSymbolDaoImpl extends BaseDao implements MainSymbolDao {
    private final static String QUERY = "SELECT exchange_id, main_symbol_id FROM system_main_symbol ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<MainSymbol> select() throws Exception {
        List<MainSymbol> list = new ArrayList<MainSymbol>();
        execute(jt8Ds.getConnection(),QUERY,list,MainSymbol.class);
        return list;
    }
}
