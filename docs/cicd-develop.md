# CI/CD cho nhánh `develop`

Workflow `.github/workflows/develop.yml` đang áp dụng flow sau:

1. Khi tạo `pull request` vào `develop`, GitHub Actions chạy:
   - `pnpm install --frozen-lockfile`
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm build`
2. Khi có `push` vào `develop`, workflow chạy lại phần CI.
3. Nếu đã cấu hình đủ secrets Vercel, cùng workflow đó sẽ deploy bản `preview` cho `develop`.

## Node và package manager

- Node.js: `20.20.2` qua `.nvmrc`
- Package manager: `pnpm`

Chạy local giống CI:

```bash
nvm use
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm build
```

## Secrets cần cấu hình trên GitHub

Vào `Settings -> Secrets and variables -> Actions` và thêm:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Nếu chưa có ba secret này, workflow vẫn pass phần CI và bỏ qua bước deploy.

## Flow branch khuyến nghị

- `feature/*` -> tạo PR vào `develop`
- merge vào `develop` -> chạy CI + deploy preview/staging
- khi sẵn sàng release -> PR từ `develop` sang `main`
- `main` sẽ là nhánh production ở bước tiếp theo
