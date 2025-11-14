const ROLES = { USER: 'USER', ADMIN: 'ADMIN' };

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
  USER_EXISTS: 'Cet email est déjà utilisé',
  TOKEN_MISSING: 'Token manquant',
  TOKEN_INVALID: 'Token invalide ou expiré',
  FORBIDDEN: 'Accès refusé',
  NOT_FOUND: 'Ressource introuvable',
  INTERNAL: 'Erreur serveur interne'
};

module.exports = { ROLES, HTTP_STATUS, ERROR_MESSAGES };