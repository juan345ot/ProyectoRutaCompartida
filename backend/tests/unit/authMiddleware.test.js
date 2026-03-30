const { protect } = require('../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

jest.mock('../../models/User');
jest.mock('jsonwebtoken');

describe('Auth Middleware Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should return 401 if no authorization header is present', async () => {
        await protect(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining('no hay token')
        }));
    });

    it('should return 401 if token is invalid', async () => {
        req.headers.authorization = 'Bearer invalid-token';
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await protect(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining('token inválido')
        }));
    });

    it('should return 401 if token is expired', async () => {
        req.headers.authorization = 'Bearer expired-token';
        const error = new Error('Expired');
        error.name = 'TokenExpiredError';
        jwt.verify.mockImplementation(() => {
            throw error;
        });

        await protect(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining('Sesión expirada')
        }));
    });

    it('should call next() if token is valid and user exists', async () => {
        req.headers.authorization = 'Bearer valid-token';
        jwt.verify.mockReturnValue({ id: 'user-id' });
        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue({ _id: 'user-id', name: 'Test User' })
        });

        await protect(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
