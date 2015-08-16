package com.jelly.jt8.bo.service;

import com.jelly.jt8.bo.model.Exchange;

import java.util.List;

/**
 * Created by user on 2015/8/15.
 */
public interface MainSymbolService {
    List<Exchange> selectExchange() throws Exception;
}
