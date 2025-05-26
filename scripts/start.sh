#!/bin/bash
sudo systemctl restart nginx
cd /home/ec2-user/JobbyApp
npm run build
npx serve -s build -l 3000
