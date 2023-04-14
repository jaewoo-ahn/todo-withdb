const {PrismaClient} = require("@prisma/client");
const express = require("express");

const router = express.Router();

const prisma = new PrismaClient();

// 투두 생성
router.post("/", async (req, res) => {
  try {
    const {todo, account} = req.body;

    if (!todo) {
      return res.status(400).json({ok: false, error: "Not exist todo."});
    }
    if (!account) {
      return res.status(400).json({ok: false, error: "Not exist account."});
    }

    const user = await prisma.user.findUnique({
      where: {
        account,
      },
    });

    if (!user) {
      return res.status(400).json({ok: false, error: "Not exist user."});
    }

    const newTodo = await prisma.todo.create({
      data: {
        todo,
        isDone: false,
        userId: user.id,
      },
    });

    res.json({ok: true, todo: newTodo});
  } catch (error) {
    console.error(error);
  }
});

// 투두 조회
router.get("/", async (req, res) => {
  try {
    const {account} = req.body;

    const todos = await prisma.todo.findMany({
      where: {
        account,
      },
    });

    res.json({ok: true, todos});
  } catch (error) {
    console.error(error);
  }
});

// 투두 완료
router.put("/:id/done", async (req, res) => {
  try {
    const {id} = req.params;

    const existTodo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existTodo) {
      return res.status(400).json({ok: false, error: "Not exist todo."});
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        isDone: !existTodo.isDone,
      },
    });

    res.json({ok: true, todo: updatedTodo});
  } catch (error) {
    console.error(error);
  }
});

// 투두 삭제
router.delete("/:id", async (req, res) => {
  try {
    const {id} = req.params;

    const existTodo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existTodo) {
      return res.status(400).json({ok: false, error: "Not exist todo."});
    }

    const deletedTodo = await prisma.todo.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json({ok: true, todo: deletedTodo});
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
