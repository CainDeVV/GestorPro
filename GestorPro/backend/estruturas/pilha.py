class Pilha:
    def __init__(self):
        self.itens = []

    def empilhar(self, item):
        """Adiciona um item no topo da pilha."""
        self.itens.append(item)

    def desempilhar(self):
        """Remove e retorna o item do topo da pilha. Retorna None se vazia."""
        if not self.vazia():
            return self.itens.pop()
        return None

    def topo(self):
        """Retorna o item do topo sem remover. Retorna None se vazia."""
        if not self.vazia():
            return self.itens[-1]
        return None

    def vazia(self):
        """Verifica se a pilha está vazia."""
        return len(self.itens) == 0

    def tamanho(self):
        """Retorna a quantidade de itens na pilha."""
        return len(self.itens)

    def limpar(self):
        """Limpa todos os itens da pilha."""
        self.itens.clear()

    def __repr__(self):
        return f"Pilha({self.itens})"
