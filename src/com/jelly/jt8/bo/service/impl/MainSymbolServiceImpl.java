package com.jelly.jt8.bo.service.impl;

import com.jelly.jt8.bo.dao.MainSymbolDao;
import com.jelly.jt8.bo.model.Exchange;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.service.MainSymbolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by user on 2015/8/15.
 */
@Service("mainSymbolService")
public class MainSymbolServiceImpl implements MainSymbolService {
    @Autowired
    @Qualifier("MainSymbolDao")
    private MainSymbolDao mainSymbolDao;

    @Override
    public List<Exchange> selectExchange() throws Exception {
        List<MainSymbol> mainSymbolList = mainSymbolDao.select();
        List<Exchange> exchangeList = new ArrayList<Exchange>();
        Map<String,Exchange> map = new HashMap<String,Exchange>();
        Exchange exchange = null;
        String exchange_id = null;
        for (MainSymbol mainSymbol : mainSymbolList) {
            exchange_id = mainSymbol.getExchange_id();
            exchange = map.get(exchange_id);
            if(!map.containsKey(exchange_id)){
                exchange = new Exchange();
                exchange.setExchange_id(exchange_id);
                exchange.setMainSymbolList(new ArrayList<MainSymbol>());
                map.put(exchange_id, exchange);
                exchangeList.add(exchange);
            }
            exchange.getMainSymbolList().add(mainSymbol);
        }
        return exchangeList;
    }
}
