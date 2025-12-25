#!/bin/bash
cd /home/kavia/workspace/code-generation/user-dashboard-and-task-management-system-301790-301801/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

