npm run build:prod
CB=$(git rev-parse --abbrev-ref HEAD)
echo -e "Current: ${CB}"
cp -r ./dist ../
echo -e "Tmp copy"
git checkout gh-pages
echo -e "Checkout gh-pages"
rm -rf ./dist
echo -e "Cleanup /dist"
cp -rf ../dist/* .
echo -e "Copy tmp"
git add .
echo -e "Add changes"
git commit -m ":package: $(date +"%m%d%Y%H%M")"
echo -e "Commit changes"
git push
echo -e "Push changes"
git checkout "${CB}"
echo -e "Back to ${CB}"
rm -rf ../dist
echo -e "Remove tmp"