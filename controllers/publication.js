const Publication = require('../models/publication');

class PublicationController {
  async create(req, res) {
    const { user } = req;
    const text = req.body.text;
    const image = req.body.image || '';

    const publication = new Publication({ text, image, user });

    const publicationSaved = await publication.save();

    res.status(200).json({
      status: 'success',
      data: {
        publication: publicationSaved,
      },
    });
    try {
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  async update(req, res) {}

  async getPublications(req, res) {
    const { user } = req;

    try {
      const publications = await Publication.find({ user }).select('-user');

      res.status(200).json({
        status: 'success',
        data: {
          publications,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  async getPublication(req, res) {
    const { id } = req.params;
    const { user } = req;
    try {
      const publication = await Publication.findById(id);

      if (!publication) {
        throw new Error('No existe la publicación');
      }

      const publicationUser = publication.user;

      if (publicationUser != user) {
        throw new Error('No tienes permiso para ver esta publicación');
      }

      res.status(200).json({
        status: 'success',
        data: {
          publication,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    const { user } = req;
    try {
      const publication = await Publication.findById(id);

      if (!publication) {
        throw new Error('No existe la publicación');
      }

      const publicationUser = publication.user;
      if (publicationUser != user) {
        throw new Error('No tienes permiso para borrar esta publicación');
      }

      await Publication.findByIdAndDelete(id);

      res.status(200).json({
        status: 'success',
        data: {
          publication,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  async publicationsFromFollowedUsers(req, res) {
    const { user } = req;
    const { page, limit } = req.query;

    try {
      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = parseInt(limit, 10) || 10;

      const count = await Publication.countDocuments({
        user: { $in: user.following },
      });

      const publications = await Publication.find({
        user: { $in: user.following },
      })
        .select('-user')
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      res.status(200).json({
        status: 'success',
        data: {
          publications,
          totalPages: Math.ceil(count / pageSize),
          currentPage: pageNumber,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }
}

module.exports = new PublicationController();
