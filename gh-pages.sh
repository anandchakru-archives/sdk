CB=$(git rev-parse --abbrev-ref HEAD)
echo -e "Current: ${CB}"
cp -r ./dist ../
echo -e "Tmp copy"
git checkout gh-pages
echo -e "Checkout gh-pages"
cp -rf ../dist/ .
echo -e "Copy tmp"
git add .
echo -e "Add changes"
git commit -m ":package: $(git rev-parse --short HEAD)"
echo -e "Commit changes"
git push
echo -e "Push changes"
git checkout "${CB}"
echo -e "Back to ${CB}"