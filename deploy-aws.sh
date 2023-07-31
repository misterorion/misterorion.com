
mkdir /tmp/empty
aws s3 sync /tmp/empty s3://www-mechapower/misterorion-com --delete
rm -rf /tmp/empty
aws s3 sync ./dist s3://www-mechapower/misterorion-com