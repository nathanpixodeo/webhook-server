
# Webhook Server

This project is a Node.js-based webhook server designed to listen for GitHub webhook events and run specific commands in response. It can be used for tasks such as automated deployments, running tests, or executing scripts based on the events received from your GitHub repository.

## Setup Instructions

Follow the steps below to set up and run the webhook server:

### 1. Clone the Repository

First, clone this repository to your server and navigate to the project directory:

```bash
git clone https://github.com/yourusername/example-webhook.git
cd example-webhook
```

### 2. Set Permissions for the Log File

Ensure that the log file has the correct permissions so that the webhook server can write to it:

```bash
sudo chmod 664 /www/html/example-webhook/logs.log
```

### 3. Install Dependencies

Install the necessary Node.js packages. This includes `dotenv` for managing environment variables:

```bash
npm install
npm install dotenv
```

### 4. Install PM2 to Manage the Server

PM2 is a process manager that will keep your Node.js application running continuously, even after server restarts. Install PM2 globally on your server:

```bash
sudo npm install -g pm2
```

### 5. Run the Webhook Server

You can start the webhook server in either debug mode or production mode:

- **Debug Mode:** Runs the server in the foreground, displaying logs and allowing you to debug any issues.

```bash
node webhook-server.js
```

- **Production Mode:** Use PM2 to run the server in the background. This is recommended for production environments.

```bash
pm2 start webhook-server.js --name "webhook-server"
```

### 6. Configure GitHub Webhook

1. Go to your GitHub repository.
2. Navigate to **Settings** > **Webhooks** > **Add webhook**.
3. Set the **Payload URL** to your server's endpoint, e.g., `http://yourserver.com/webhook`.
4. Choose `application/json` as the **Content type**.
5. Select the events you want to trigger the webhook.
6. Save the webhook.

### 7. Monitoring and Logs

You can monitor the webhook server using PM2:

```bash
pm2 logs webhook-server
```

This will display the logs, where you can see incoming requests and actions performed by the server.

### 8. Restarting the Server

If you make any changes to the server code, you can restart the server using PM2:

```bash
pm2 restart webhook-server
```

### 9. Stopping the Server

To stop the server, use the following command:

```bash
pm2 stop webhook-server
```

### 10. Auto-start on Reboot

To ensure that your webhook server starts automatically when your server reboots, run:

```bash
pm2 startup
pm2 save
```

This will generate and configure a startup script for PM2.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to submit pull requests or open issues to contribute to the project.
