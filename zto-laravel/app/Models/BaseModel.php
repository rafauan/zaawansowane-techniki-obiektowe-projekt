<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

abstract class BaseModel extends Model
{
    protected static string $defaultDateFormat = 'Y-m-d H:i:s';

    // Logowanie operacji
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            Log::info('Creating a new record', ['model' => static::class, 'data' => $model->attributes]);
        });

        static::updating(function ($model) {
            Log::info('Updating a record', ['model' => static::class, 'data' => $model->attributes]);
        });

        static::deleting(function ($model) {
            Log::info('Deleting a record', ['model' => static::class, 'id' => $model->id]);
        });
    }
 
    // Prosta funkcja do logowania akcji
    public function logAction(string $action): void
    {
        Log::info($action, ['model' => static::class, 'id' => $this->id]);
    }

    public static function createRecord(array $data): self
    {
        return static::create($data);
    }

    public static function getRecord(int $id): self
    {
        $record = static::find($id);

        if (!$record) throw new \Exception('Record not found');

        return $record;
    }

    public static function updateRecord(int $id, array $data): self
    {
        $record = static::find($id);

        if (!$record) throw new \Exception('Record not found');

        $record->update($data);
        
        return $record;
    }

    public static function deleteRecord(int $id): void
    {
        if (!static::find($id)) throw new \Exception('Record not found');

        static::destroy($id);
    }
}
