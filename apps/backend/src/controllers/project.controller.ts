import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import _ from 'lodash';
import { AuthenticatedRequest } from '../middlewares/authenticate';

const prisma = new PrismaClient();

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany();

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: '프로젝트 가져오기 실패' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) res.status(404).json({ message: '프로젝트 Not Found' });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: '프로젝트 가져오기 실패' });
  }
};

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { title, description, link } = req.body;
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        link,
      },
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: '프로젝트 생성 실패' });
  }
};

export const updateProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);
    const { title, description, link } = req.body;

    const updateData = _.pickBy(
      _.pick({ title, description, link }),
      _.identity,
    );
    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '프로젝트 수정 실패' });
  }
};

export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);
    await prisma.project.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '프로젝트 삭제 실패' });
  }
};
