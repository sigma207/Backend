package com.jelly.thread;

import com.jelly.service.BulletinService;

/**
 * Created by user on 2015/7/6.
 */
public class RunCache implements Runnable {
    BulletinService service;

    public RunCache(BulletinService service) {
        this.service = service;
    }

    public void run(){
        try {
            while (true){
                service.getBulletinList();
                Thread.sleep(5000);
            }
        }catch (Exception e){
            e.printStackTrace();
        }

    }
}
