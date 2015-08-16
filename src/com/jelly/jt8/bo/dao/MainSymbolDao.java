package com.jelly.jt8.bo.dao;

import com.jelly.jt8.bo.model.MainSymbol;

import java.util.List;

/**
 * Created by user on 2015/8/15.
 */
public interface MainSymbolDao {
    List<MainSymbol> select() throws Exception;
}
