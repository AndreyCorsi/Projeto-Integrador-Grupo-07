import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { AlertTriangle, Edit2, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { EPI, Funcionario, EPIAtribuicao } from "@/types";
import { differenceInDays, parseISO } from "date-fns";
import { EPIAPI } from "@/lib/api";

interface EPIsVencidasProps {
  epis: EPI[];
  funcionarios: Funcionario[];
  atribuicoes: EPIAtribuicao[];
  onUpdateCA: (epi: EPI) => void;
}

export const EPIsVencidas = ({ epis, funcionarios, atribuicoes, onUpdateCA }: EPIsVencidasProps) => {
  const [episProximosVencer, setEpisProximosVencer] = useState<any[]>([]);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  useEffect(() => {
    const fetchEPIsVencendo = async () => {
      setIsLoadingAPI(true);
      try {
        const response = await EPIAPI.buscarProximosDeVencer(30);
        setEpisProximosVencer(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar EPIs próximos de vencer:", error);
      } finally {
        setIsLoadingAPI(false);
      }
    };

    fetchEPIsVencendo();
  }, [epis]);

  const getExpiredEPIs = () => {
    return epis
      .filter(epi => {
        const days = differenceInDays(parseISO(epi.validade), new Date());
        return days < 0;
      })
      .sort((a, b) => parseISO(a.validade).getTime() - parseISO(b.validade).getTime());
  };

  const getExpiringEPIs = () => {
    return epis
      .filter(epi => {
        const days = differenceInDays(parseISO(epi.validade), new Date());
        return days >= 0 && days <= 30;
      })
      .sort((a, b) => parseISO(a.validade).getTime() - parseISO(b.validade).getTime());
  };

  const getHealthyEPIs = () => {
    return epis
      .filter(epi => {
        const days = differenceInDays(parseISO(epi.validade), new Date());
        return days > 60;
      })
      .sort((a, b) => parseISO(a.validade).getTime() - parseISO(b.validade).getTime());
  };

  const getDaysExpired = (validade: string) => {
    return Math.abs(differenceInDays(parseISO(validade), new Date()));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getFuncionariosComEPI = (epiId: string) => {
    const funcionariosIds = atribuicoes
      .filter(at => at.epiId === epiId)
      .map(at => at.funcionarioId);
    
    return funcionariosIds
      .map(id => funcionarios.find(f => f.id === id)?.nome)
      .filter(Boolean)
      .join(", ") || "Não atribuído";
  };

  const expiredEPIs = getExpiredEPIs();
  const expiringEPIs = getExpiringEPIs();
  const healthyEPIs = getHealthyEPIs();

  return (
    <div className="space-y-6">
      <Card className="animate-in fade-in duration-500">
      <CardHeader className="bg-destructive">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
          <CardTitle className="text-destructive-foreground">
            EPIs Vencidas ({expiredEPIs.length})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {expiredEPIs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum EPI vencido no momento
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CA</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Dias Vencida</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Funcionários</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiredEPIs.map((epi) => (
                  <TableRow key={epi.id} className="bg-destructive/5">
                    <TableCell className="font-medium">{epi.nome}</TableCell>
                    <TableCell>{epi.ca}</TableCell>
                    <TableCell>{formatDate(epi.validade)}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        {getDaysExpired(epi.validade)} dias
                      </Badge>
                    </TableCell>
                    <TableCell>{epi.tipo}</TableCell>
                    <TableCell>
                      {getFuncionariosComEPI(epi.id)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onUpdateCA(epi)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>

    <Card className="animate-in fade-in duration-500">
      <CardHeader className="bg-amber-500">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-amber-950" />
          <CardTitle className="text-amber-950">
            EPIs Próximas de Vencer ({expiringEPIs.length})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {expiringEPIs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum EPI próximo de vencer (30 dias)
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CA</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Dias Restantes</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Funcionários</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringEPIs.map((epi) => {
                  const daysRemaining = differenceInDays(parseISO(epi.validade), new Date());
                  return (
                    <TableRow key={epi.id} className="bg-amber-500/5">
                      <TableCell className="font-medium">{epi.nome}</TableCell>
                      <TableCell>{epi.ca}</TableCell>
                      <TableCell>{formatDate(epi.validade)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-amber-500 text-amber-700">
                          {daysRemaining} dias
                        </Badge>
                      </TableCell>
                      <TableCell>{epi.tipo}</TableCell>
                      <TableCell>
                        {getFuncionariosComEPI(epi.id)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateCA(epi)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>

    <Card className="animate-in fade-in duration-500">
      <CardHeader className="bg-green-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-green-950" />
          <CardTitle className="text-green-950">
            EPIs em Dia (+60 dias) ({healthyEPIs.length})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {healthyEPIs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum EPI com mais de 60 dias para vencer
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CA</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Dias Restantes</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Funcionários</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healthyEPIs.map((epi) => {
                  const daysRemaining = differenceInDays(parseISO(epi.validade), new Date());
                  return (
                    <TableRow key={epi.id} className="bg-green-500/5">
                      <TableCell className="font-medium">{epi.nome}</TableCell>
                      <TableCell>{epi.ca}</TableCell>
                      <TableCell>{formatDate(epi.validade)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-500 text-green-700">
                          {daysRemaining} dias
                        </Badge>
                      </TableCell>
                      <TableCell>{epi.tipo}</TableCell>
                      <TableCell>
                        {getFuncionariosComEPI(epi.id)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateCA(epi)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
};
