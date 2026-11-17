#!/bin/bash
# Run against a throwaway Mattermost:
#   docker run -d --name mattermost-test -p 8065:8065 mattermost/mattermost-preview
# then: eval "$(server/scripts/mattermost/setup.sh)" and start the demo with
#   MATTERMOST_URL=http://localhost:8065 node --import tsx server/scripts/demo.ts
# and run: node --import tsx server/scripts/mattermost/e2e.ts
# Test Mattermost: an admin, a family team, three people and a FAITH bot.
set -e
MM=http://localhost:8065/api/v4
j() { curl -sS -H "Content-Type: application/json" -H "X-Requested-With: XMLHttpRequest" "$@"; }
j -X POST $MM/users -d '{"email":"admin@example.test","username":"admin","password":"Admin-pass-123"}' >/dev/null || true
TOKEN=$(curl -sS -i -H "Content-Type: application/json" -X POST $MM/users/login -d '{"login_id":"admin","password":"Admin-pass-123"}' | grep -i '^token:' | awk '{print $2}' | tr -d '\r')
A=(-H "Authorization: Bearer $TOKEN")
TEAM=$(j "${A[@]}" -X POST $MM/teams -d '{"name":"family","display_name":"Family","type":"I"}' | python3 -c 'import sys,json;d=json.load(sys.stdin);print(d.get("id",""))')
[ -z "$TEAM" ] && TEAM=$(j "${A[@]}" $MM/teams/name/family | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])')
for u in wizard sam robin; do
  j "${A[@]}" -X POST $MM/users -d "{\"email\":\"$u@example.test\",\"username\":\"$u\",\"password\":\"Pass-$u-123\"}" >/dev/null
  UID_=$(j "${A[@]}" $MM/users/username/$u | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])')
  j "${A[@]}" -X POST $MM/teams/$TEAM/members -d "{\"team_id\":\"$TEAM\",\"user_id\":\"$UID_\"}" >/dev/null
done
BOT=$(j "${A[@]}" -X POST $MM/bots -d '{"username":"faith","display_name":"Faith","description":"The family assistant"}' | python3 -c 'import sys,json;d=json.load(sys.stdin);print(d.get("user_id",""))')
[ -z "$BOT" ] && BOT=$(j "${A[@]}" $MM/users/username/faith | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])')
j "${A[@]}" -X POST $MM/teams/$TEAM/members -d "{\"team_id\":\"$TEAM\",\"user_id\":\"$BOT\"}" >/dev/null
BOTTOKEN=$(j "${A[@]}" -X POST $MM/users/$BOT/tokens -d '{"description":"FAITH"}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["token"])')
echo "# team $TEAM, bot $BOT" >&2
echo "export MATTERMOST_BOT_TOKEN=$BOTTOKEN"
