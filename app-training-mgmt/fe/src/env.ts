import { z } from 'zod';

const envSchema = z.object({
	REACT_APP_API_BASE_URL: z.string().url(),
	REACT_APP_API_VERSIONING_HEADER: z.string().trim(),
	REACT_APP_API_VERSION: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error(
		`Missing or invalid environment variable${
			parsed.error.errors.length > 1 ? 's' : ''
		}:
${parsed.error.errors
	.map((error) => `  ${error.path}: ${error.message}`)
	.join('\n')}
`
	);
	process.exit(1);
}

export const env = parsed.data;
