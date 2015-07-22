package com.jelly.service;

import com.jelly.socket.SocketThread;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

/**
 * Created by user on 2015/7/1.
 */
public class SocketService {
    private int currentValue = 0;
    private Thread socketThread = null;

    public InetAddress getHost() {
        return host;
    }

    public void setHost(InetAddress host) {
        this.host = host;
    }

    private InetAddress host;
    public void init() throws Exception{
        System.out.println("SocketService init......");
        try{
            host = InetAddress.getLocalHost();
        }catch (UnknownHostException e){
            e.printStackTrace();
        }
        updateSideTrend();
    }

    public void updateSideTrend() {
        socketThread = new Thread(new SocketThread(this));
        socketThread.start();
    }

    public int getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(int currentValue) {
        System.out.println("setCurrentValue:"+currentValue);
        this.currentValue = currentValue;
    }
}
