package com.jelly.socket;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

/**
 * Created by user on 2015/7/1.
 */
public class SocketClientExample {
    public static void main(String[] args) throws UnknownHostException,IOException,ClassNotFoundException,InterruptedException{
        InetAddress host = InetAddress.getLocalHost();
        Socket socket = null;
        ObjectOutputStream oos = null;
        ObjectInputStream ois = null;

        for(int i=0;i<5;i++){
            System.out.println("start to connect");
            socket = new Socket(host.getHostName(),9876);
            System.out.println("new Socket");
            oos = new ObjectOutputStream(socket.getOutputStream());
            System.out.println("Sending request to Socket server");
            if(i==4)oos.writeObject("exit");
            else oos.writeObject(String.valueOf(i));

            ois = new ObjectInputStream(socket.getInputStream());
            String message = (String)ois.readObject();
            System.out.println("Message " + message);
            ois.close();
            oos.close();

            Thread.sleep(100);
        }
    }
}
