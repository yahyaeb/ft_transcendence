#!/usr/bin/env bash
cp -r ./certs ../frontend/ft_front/
cp -r ./certs ../GAME/
echo "JWT_SECRET = 'abc123'" > ../.env